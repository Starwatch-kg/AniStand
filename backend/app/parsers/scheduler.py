from celery import Celery
from celery.schedules import crontab
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import datetime, timedelta
from typing import List, Dict
import asyncio
from loguru import logger

from app.config import settings
from app.database import AsyncSessionLocal
from app.models.anime import Anime
from app.models.episode import Episode, VideoSource
from app.parsers.anilist_parser import AniListParser
from app.parsers.animepahe_parser import AnimePaheParser
from app.parsers.gogoanime_parser import GogoAnimeParser
from app.services.anime_service import AnimeService
from app.services.episode_service import EpisodeService

# Создание Celery приложения
celery_app = Celery(
    'anistand_parser',
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Конфигурация Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 минут
    task_soft_time_limit=25 * 60,  # 25 минут
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Расписание задач
celery_app.conf.beat_schedule = {
    'update-anime-metadata': {
        'task': 'app.parsers.scheduler.update_anime_metadata',
        'schedule': crontab(minute=0, hour='*/6'),  # Каждые 6 часов
    },
    'update-video-sources': {
        'task': 'app.parsers.scheduler.update_video_sources',
        'schedule': crontab(minute=0, hour='*/2'),  # Каждые 2 часа
    },
    'check-new-episodes': {
        'task': 'app.parsers.scheduler.check_new_episodes',
        'schedule': crontab(minute=0),  # Каждый час
    },
    'cleanup-inactive-sources': {
        'task': 'app.parsers.scheduler.cleanup_inactive_sources',
        'schedule': crontab(minute=0, hour=2),  # Каждый день в 2:00
    },
}


@celery_app.task(bind=True)
def update_anime_metadata(self):
    """Обновление метаданных аниме из AniList"""
    logger.info("Starting anime metadata update task")
    
    try:
        asyncio.run(_update_anime_metadata())
        logger.info("Anime metadata update completed successfully")
        return {"status": "success", "message": "Metadata updated"}
    except Exception as e:
        logger.error(f"Error updating anime metadata: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)


@celery_app.task(bind=True)
def update_video_sources(self):
    """Обновление источников видео"""
    logger.info("Starting video sources update task")
    
    try:
        asyncio.run(_update_video_sources())
        logger.info("Video sources update completed successfully")
        return {"status": "success", "message": "Video sources updated"}
    except Exception as e:
        logger.error(f"Error updating video sources: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)


@celery_app.task(bind=True)
def check_new_episodes(self):
    """Проверка новых эпизодов для активных аниме"""
    logger.info("Starting new episodes check task")
    
    try:
        asyncio.run(_check_new_episodes())
        logger.info("New episodes check completed successfully")
        return {"status": "success", "message": "New episodes checked"}
    except Exception as e:
        logger.error(f"Error checking new episodes: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)


@celery_app.task(bind=True)
def cleanup_inactive_sources(self):
    """Очистка неактивных источников видео"""
    logger.info("Starting cleanup of inactive video sources")
    
    try:
        asyncio.run(_cleanup_inactive_sources())
        logger.info("Cleanup of inactive sources completed successfully")
        return {"status": "success", "message": "Inactive sources cleaned up"}
    except Exception as e:
        logger.error(f"Error cleaning up inactive sources: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)


@celery_app.task(bind=True)
def parse_anime_from_source(self, source: str, anime_id: str):
    """Парсинг конкретного аниме из указанного источника"""
    logger.info(f"Parsing anime {anime_id} from {source}")
    
    try:
        result = asyncio.run(_parse_anime_from_source(source, anime_id))
        logger.info(f"Successfully parsed anime {anime_id} from {source}")
        return result
    except Exception as e:
        logger.error(f"Error parsing anime {anime_id} from {source}: {str(e)}")
        raise self.retry(exc=e, countdown=60, max_retries=3)


# Асинхронные функции для выполнения задач

async def _update_anime_metadata():
    """Обновить метаданные всех аниме из AniList"""
    
    async with AsyncSessionLocal() as db:
        anime_service = AnimeService(db)
        
        # Получаем все аниме с anilist_id
        result = await db.execute(
            select(Anime).where(Anime.anilist_id.isnot(None))
        )
        anime_list = result.scalars().all()
        
        logger.info(f"Updating metadata for {len(anime_list)} anime")
        
        async with AniListParser() as parser:
            for anime in anime_list:
                try:
                    # Получаем обновленные данные
                    updated_data = await parser.get_anime_metadata(str(anime.anilist_id))
                    
                    if updated_data:
                        # Обновляем только определенные поля
                        anime.average_score = updated_data.get("average_score") or anime.average_score
                        anime.popularity = updated_data.get("popularity") or anime.popularity
                        anime.status = updated_data.get("status") or anime.status
                        anime.episodes = updated_data.get("episodes") or anime.episodes
                        
                        await db.commit()
                        logger.debug(f"Updated metadata for anime {anime.id}")
                    
                    # Задержка между запросами
                    await asyncio.sleep(settings.PARSER_DELAY)
                    
                except Exception as e:
                    logger.error(f"Error updating anime {anime.id}: {str(e)}")
                    continue


async def _update_video_sources():
    """Обновить источники видео для эпизодов"""
    
    async with AsyncSessionLocal() as db:
        episode_service = EpisodeService(db)
        
        # Получаем эпизоды, которые нужно обновить (старше 2 часов)
        cutoff_time = datetime.utcnow() - timedelta(hours=2)
        result = await db.execute(
            select(Episode).where(Episode.updated_at < cutoff_time).limit(50)
        )
        episodes = result.scalars().all()
        
        logger.info(f"Updating video sources for {len(episodes)} episodes")
        
        parsers = [AnimePaheParser(), GogoAnimeParser()]
        
        for parser in parsers:
            async with parser:
                for episode in episodes:
                    try:
                        # Получаем новые источники видео
                        sources = await parser.get_video_sources(str(episode.id))
                        
                        for source_data in sources:
                            # Добавляем новый источник
                            await episode_service.add_video_source(
                                episode_id=episode.id,
                                source_name=source_data["source_name"],
                                video_url=source_data["video_url"],
                                quality=source_data.get("quality"),
                                subtitle_url=source_data.get("subtitle_url")
                            )
                        
                        await asyncio.sleep(settings.PARSER_DELAY)
                        
                    except Exception as e:
                        logger.error(f"Error updating sources for episode {episode.id}: {str(e)}")
                        continue


async def _check_new_episodes():
    """Проверить новые эпизоды для активных аниме"""
    
    async with AsyncSessionLocal() as db:
        # Получаем аниме со статусом RELEASING
        result = await db.execute(
            select(Anime).where(Anime.status == "RELEASING")
        )
        releasing_anime = result.scalars().all()
        
        logger.info(f"Checking new episodes for {len(releasing_anime)} releasing anime")
        
        async with AniListParser() as parser:
            for anime in releasing_anime:
                try:
                    # Получаем обновленную информацию
                    updated_data = await parser.get_anime_metadata(str(anime.anilist_id))
                    
                    if updated_data and updated_data.get("episodes"):
                        current_episodes = updated_data["episodes"]
                        
                        # Если количество эпизодов увеличилось
                        if current_episodes > (anime.episodes or 0):
                            anime.episodes = current_episodes
                            
                            # Создаем новые эпизоды
                            episode_service = EpisodeService(db)
                            
                            for ep_num in range((anime.episodes or 0) + 1, current_episodes + 1):
                                await episode_service.create_episode({
                                    "anime_id": anime.id,
                                    "episode_number": ep_num,
                                    "title": f"Episode {ep_num}",
                                    "duration": (anime.duration or 24) * 60
                                })
                            
                            await db.commit()
                            logger.info(f"Added new episodes for anime {anime.id}")
                    
                    await asyncio.sleep(settings.PARSER_DELAY)
                    
                except Exception as e:
                    logger.error(f"Error checking episodes for anime {anime.id}: {str(e)}")
                    continue


async def _cleanup_inactive_sources():
    """Очистить неактивные источники видео"""
    
    async with AsyncSessionLocal() as db:
        # Получаем старые источники видео (старше 24 часов)
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        result = await db.execute(
            select(VideoSource).where(VideoSource.updated_at < cutoff_time)
        )
        old_sources = result.scalars().all()
        
        logger.info(f"Checking {len(old_sources)} old video sources")
        
        inactive_count = 0
        
        for source in old_sources:
            try:
                # Проверяем доступность ссылки
                async with AsyncSessionLocal().session.get(source.video_url) as response:
                    if response.status != 200:
                        source.is_active = False
                        inactive_count += 1
                        
            except Exception:
                # Если ссылка недоступна, помечаем как неактивную
                source.is_active = False
                inactive_count += 1
        
        await db.commit()
        logger.info(f"Marked {inactive_count} sources as inactive")


async def _parse_anime_from_source(source: str, anime_id: str) -> Dict:
    """Парсинг аниме из конкретного источника"""
    
    parser_map = {
        "anilist": AniListParser,
        "animepahe": AnimePaheParser,
        "gogoanime": GogoAnimeParser
    }
    
    if source not in parser_map:
        raise ValueError(f"Unknown source: {source}")
    
    parser_class = parser_map[source]
    
    async with parser_class() as parser:
        # Получаем метаданные
        anime_data = await parser.get_anime_metadata(anime_id)
        
        if not anime_data:
            return {"status": "error", "message": "Anime not found"}
        
        # Получаем эпизоды
        episodes = await parser.get_episodes(anime_id)
        
        return {
            "status": "success",
            "anime": anime_data,
            "episodes": episodes,
            "source": source
        }
