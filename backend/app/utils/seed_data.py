"""
Скрипт для заполнения базы данных тестовыми данными
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date, datetime

from app.database import AsyncSessionLocal
from app.models.anime import Anime, Genre, Studio
from app.models.episode import Episode, VideoSource
from app.models.user import User
from app.services.user_service import UserService
from app.schemas.user import UserCreate
from loguru import logger


async def create_genres(db: AsyncSession) -> dict:
    """Создать жанры"""
    genres_data = [
        "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
        "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports",
        "Supernatural", "Thriller", "Mecha", "School", "Military",
        "Historical", "Psychological", "Seinen", "Shounen", "Shoujo",
        "Josei", "Ecchi", "Harem", "Isekai", "Magic"
    ]
    
    genres_map = {}
    
    for genre_name in genres_data:
        # Проверяем, существует ли жанр
        result = await db.execute(select(Genre).where(Genre.name == genre_name))
        existing_genre = result.scalar_one_or_none()
        
        if not existing_genre:
            genre = Genre(name=genre_name)
            db.add(genre)
            await db.flush()
            genres_map[genre_name] = genre
        else:
            genres_map[genre_name] = existing_genre
    
    await db.commit()
    logger.info(f"Created {len(genres_data)} genres")
    return genres_map


async def create_studios(db: AsyncSession) -> dict:
    """Создать студии"""
    studios_data = [
        "Studio Pierrot", "Madhouse", "Toei Animation", "Bones", "A-1 Pictures",
        "Mappa", "Wit Studio", "Production I.G", "Trigger", "Kyoto Animation",
        "Shaft", "Gainax", "Studio Ghibli", "Sunrise", "J.C.Staff",
        "White Fox", "Doga Kobo", "CloverWorks", "Ufotable", "Studio Deen",
        "Gonzo", "Xebec", "Brain's Base", "P.A.Works", "Silver Link"
    ]
    
    studios_map = {}
    
    for studio_name in studios_data:
        # Проверяем, существует ли студия
        result = await db.execute(select(Studio).where(Studio.name == studio_name))
        existing_studio = result.scalar_one_or_none()
        
        if not existing_studio:
            studio = Studio(name=studio_name)
            db.add(studio)
            await db.flush()
            studios_map[studio_name] = studio
        else:
            studios_map[studio_name] = existing_studio
    
    await db.commit()
    logger.info(f"Created {len(studios_data)} studios")
    return studios_map


async def create_sample_anime(db: AsyncSession, genres_map: dict, studios_map: dict):
    """Создать примеры аниме"""
    
    anime_data = [
        {
            "anilist_id": 16498,
            "title_romaji": "Shingeki no Kyojin",
            "title_english": "Attack on Titan",
            "title_native": "進撃の巨人",
            "description": "Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction.",
            "cover_image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-73IhOXpJZiMF.jpg",
            "episodes": 25,
            "duration": 24,
            "status": "FINISHED",
            "start_date": date(2013, 4, 7),
            "end_date": date(2013, 9, 29),
            "season": "SPRING",
            "season_year": 2013,
            "average_score": 85,
            "popularity": 100000,
            "genres": ["Action", "Drama", "Fantasy", "Shounen"],
            "studios": ["Wit Studio"]
        },
        {
            "anilist_id": 21459,
            "title_romaji": "Boku no Hero Academia",
            "title_english": "My Hero Academia",
            "title_native": "僕のヒーローアカデミア",
            "description": "A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy.",
            "cover_image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21459-RoPwgrZ32gM3.jpg",
            "episodes": 13,
            "duration": 24,
            "status": "FINISHED",
            "start_date": date(2016, 4, 3),
            "end_date": date(2016, 6, 26),
            "season": "SPRING",
            "season_year": 2016,
            "average_score": 78,
            "popularity": 95000,
            "genres": ["Action", "Comedy", "School", "Shounen", "Supernatural"],
            "studios": ["Bones"]
        },
        {
            "anilist_id": 11061,
            "title_romaji": "Hunter x Hunter (2011)",
            "title_english": "Hunter x Hunter",
            "title_native": "ハンター×ハンター",
            "description": "A young boy named Gon Freecss discovers that his father, who left him at a young age, is actually a world-renowned Hunter.",
            "cover_image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-sIpTZ9bdhzuE.jpg",
            "episodes": 148,
            "duration": 24,
            "status": "FINISHED",
            "start_date": date(2011, 10, 2),
            "end_date": date(2014, 9, 24),
            "season": "FALL",
            "season_year": 2011,
            "average_score": 92,
            "popularity": 88000,
            "genres": ["Action", "Adventure", "Fantasy", "Shounen"],
            "studios": ["Madhouse"]
        },
        {
            "anilist_id": 20958,
            "title_romaji": "Shingeki no Kyojin Season 2",
            "title_english": "Attack on Titan Season 2",
            "title_native": "進撃の巨人 Season2",
            "description": "Eren Yeager and others of the 104th Training Corps have just begun to become full members of the Survey Corps.",
            "cover_image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20958-HuFJyr54Mmir.jpg",
            "episodes": 12,
            "duration": 24,
            "status": "FINISHED",
            "start_date": date(2017, 4, 1),
            "end_date": date(2017, 6, 17),
            "season": "SPRING",
            "season_year": 2017,
            "average_score": 87,
            "popularity": 85000,
            "genres": ["Action", "Drama", "Fantasy", "Shounen"],
            "studios": ["Wit Studio"]
        },
        {
            "anilist_id": 113415,
            "title_romaji": "Jujutsu Kaisen",
            "title_english": "Jujutsu Kaisen",
            "title_native": "呪術廻戦",
            "description": "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself.",
            "cover_image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg",
            "episodes": 24,
            "duration": 24,
            "status": "FINISHED",
            "start_date": date(2020, 10, 3),
            "end_date": date(2021, 3, 27),
            "season": "FALL",
            "season_year": 2020,
            "average_score": 86,
            "popularity": 92000,
            "genres": ["Action", "School", "Shounen", "Supernatural"],
            "studios": ["Mappa"]
        }
    ]
    
    created_anime = []
    
    for anime_info in anime_data:
        # Проверяем, существует ли аниме
        result = await db.execute(
            select(Anime).where(Anime.anilist_id == anime_info["anilist_id"])
        )
        existing_anime = result.scalar_one_or_none()
        
        if existing_anime:
            logger.info(f"Anime {anime_info['title_english']} already exists")
            created_anime.append(existing_anime)
            continue
        
        # Создаем аниме
        anime_genres = anime_info.pop("genres")
        anime_studios = anime_info.pop("studios")
        
        anime = Anime(**anime_info)
        
        # Добавляем жанры
        for genre_name in anime_genres:
            if genre_name in genres_map:
                anime.genres.append(genres_map[genre_name])
        
        # Добавляем студии
        for studio_name in anime_studios:
            if studio_name in studios_map:
                anime.studios.append(studios_map[studio_name])
        
        db.add(anime)
        await db.flush()
        created_anime.append(anime)
        
        logger.info(f"Created anime: {anime.title_english}")
    
    await db.commit()
    logger.info(f"Created {len(created_anime)} anime")
    return created_anime


async def create_sample_episodes(db: AsyncSession, anime_list: list):
    """Создать примеры эпизодов"""
    
    for anime in anime_list:
        # Проверяем, есть ли уже эпизоды
        result = await db.execute(
            select(Episode).where(Episode.anime_id == anime.id)
        )
        existing_episodes = result.scalars().all()
        
        if existing_episodes:
            logger.info(f"Episodes for {anime.title_english} already exist")
            continue
        
        # Создаем эпизоды
        for ep_num in range(1, min(anime.episodes + 1, 6)):  # Максимум 5 эпизодов для примера
            episode = Episode(
                anime_id=anime.id,
                episode_number=ep_num,
                title=f"Episode {ep_num}",
                description=f"Episode {ep_num} of {anime.title_english}",
                duration=anime.duration * 60,  # Конвертируем в секунды
                air_date=anime.start_date
            )
            
            db.add(episode)
            await db.flush()
            
            # Добавляем примеры источников видео
            video_sources = [
                {
                    "source_name": "animepahe",
                    "video_url": f"https://example.com/video/{anime.id}/{ep_num}/720p.m3u8",
                    "quality": "720p",
                    "is_active": True
                },
                {
                    "source_name": "gogoanime", 
                    "video_url": f"https://example.com/video/{anime.id}/{ep_num}/1080p.mp4",
                    "quality": "1080p",
                    "is_active": True
                }
            ]
            
            for source_data in video_sources:
                source = VideoSource(
                    episode_id=episode.id,
                    **source_data
                )
                db.add(source)
        
        logger.info(f"Created episodes for {anime.title_english}")
    
    await db.commit()
    logger.info("Created sample episodes and video sources")


async def create_sample_users(db: AsyncSession):
    """Создать примеры пользователей"""
    
    users_data = [
        {
            "username": "admin",
            "email": "admin@anistand.com",
            "password": "admin123"
        },
        {
            "username": "testuser",
            "email": "test@anistand.com", 
            "password": "test123"
        },
        {
            "username": "animeotaku",
            "email": "otaku@anistand.com",
            "password": "otaku123"
        }
    ]
    
    user_service = UserService(db)
    
    for user_data in users_data:
        # Проверяем, существует ли пользователь
        existing_user = await user_service.get_user_by_username(user_data["username"])
        
        if existing_user:
            logger.info(f"User {user_data['username']} already exists")
            continue
        
        # Создаем пользователя
        user_create = UserCreate(**user_data)
        user = await user_service.create_user(user_create)
        
        logger.info(f"Created user: {user.username}")
    
    logger.info("Created sample users")


async def seed_database():
    """Основная функция для заполнения базы данных"""
    
    logger.info("Starting database seeding...")
    
    async with AsyncSessionLocal() as db:
        try:
            # Создаем жанры и студии
            genres_map = await create_genres(db)
            studios_map = await create_studios(db)
            
            # Создаем аниме
            anime_list = await create_sample_anime(db, genres_map, studios_map)
            
            # Создаем эпизоды
            await create_sample_episodes(db, anime_list)
            
            # Создаем пользователей
            await create_sample_users(db)
            
            logger.info("Database seeding completed successfully!")
            
        except Exception as e:
            logger.error(f"Error during database seeding: {str(e)}")
            await db.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(seed_database())
