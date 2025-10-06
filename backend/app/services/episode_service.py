from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.models.episode import Episode, VideoSource
from app.models.user import WatchHistory
from app.schemas.episode import EpisodeCreate, EpisodeUpdate


class EpisodeService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_episodes_by_anime(self, anime_id: int) -> List[Episode]:
        """Получить все эпизоды аниме"""
        result = await self.db.execute(
            select(Episode).where(Episode.anime_id == anime_id)
            .options(selectinload(Episode.video_sources))
            .order_by(Episode.episode_number)
        )
        
        return result.scalars().all()

    async def get_episode_by_id(self, episode_id: int) -> Optional[Episode]:
        """Получить эпизод по ID"""
        result = await self.db.execute(
            select(Episode).where(Episode.id == episode_id)
            .options(selectinload(Episode.video_sources))
        )
        
        return result.scalar_one_or_none()

    async def get_active_video_sources(self, episode_id: int) -> List[VideoSource]:
        """Получить активные источники видео для эпизода"""
        result = await self.db.execute(
            select(VideoSource).where(
                VideoSource.episode_id == episode_id,
                VideoSource.is_active == True
            ).order_by(VideoSource.quality.desc())
        )
        
        return result.scalars().all()

    async def save_watch_progress(
        self, 
        user_id: int, 
        episode_id: int, 
        progress: int, 
        completed: bool = False
    ) -> WatchHistory:
        """Сохранить прогресс просмотра"""
        
        # Проверяем существующую запись
        existing = await self.db.execute(
            select(WatchHistory).where(
                WatchHistory.user_id == user_id,
                WatchHistory.episode_id == episode_id
            )
        )
        
        watch_history = existing.scalar_one_or_none()
        
        if watch_history:
            # Обновляем существующую запись
            watch_history.progress = progress
            watch_history.completed = completed
        else:
            # Создаем новую запись
            watch_history = WatchHistory(
                user_id=user_id,
                episode_id=episode_id,
                progress=progress,
                completed=completed
            )
            self.db.add(watch_history)
        
        await self.db.commit()
        await self.db.refresh(watch_history)
        
        return watch_history

    async def create_episode(self, episode_data: EpisodeCreate) -> Episode:
        """Создать новый эпизод"""
        episode = Episode(**episode_data.model_dump())
        
        self.db.add(episode)
        await self.db.commit()
        await self.db.refresh(episode)
        
        return episode

    async def update_episode(self, episode_id: int, episode_data: EpisodeUpdate) -> Optional[Episode]:
        """Обновить эпизод"""
        result = await self.db.execute(
            select(Episode).where(Episode.id == episode_id)
        )
        episode = result.scalar_one_or_none()
        
        if not episode:
            return None
        
        update_data = episode_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(episode, field, value)
        
        await self.db.commit()
        await self.db.refresh(episode)
        
        return episode

    async def delete_episode(self, episode_id: int) -> bool:
        """Удалить эпизод"""
        result = await self.db.execute(
            select(Episode).where(Episode.id == episode_id)
        )
        episode = result.scalar_one_or_none()
        
        if not episode:
            return False
        
        await self.db.delete(episode)
        await self.db.commit()
        
        return True

    async def add_video_source(
        self, 
        episode_id: int, 
        source_name: str, 
        video_url: str, 
        quality: str = None,
        subtitle_url: str = None
    ) -> VideoSource:
        """Добавить источник видео к эпизоду"""
        
        video_source = VideoSource(
            episode_id=episode_id,
            source_name=source_name,
            video_url=video_url,
            quality=quality,
            subtitle_url=subtitle_url
        )
        
        self.db.add(video_source)
        await self.db.commit()
        await self.db.refresh(video_source)
        
        return video_source

    async def deactivate_video_source(self, source_id: int) -> bool:
        """Деактивировать источник видео"""
        result = await self.db.execute(
            update(VideoSource)
            .where(VideoSource.id == source_id)
            .values(is_active=False)
        )
        
        await self.db.commit()
        return result.rowcount > 0
