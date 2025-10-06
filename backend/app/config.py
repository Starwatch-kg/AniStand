from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Основные настройки приложения
    APP_NAME: str = "AniStand API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # База данных
    DATABASE_URL: str = "postgresql+asyncpg://anistand:password@localhost/anistand"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    # API ключи для парсинга
    ANILIST_CLIENT_ID: Optional[str] = None
    ANILIST_CLIENT_SECRET: Optional[str] = None
    
    # Настройки парсинга
    PARSER_USER_AGENT: str = "AniStand/1.0"
    PARSER_DELAY: float = 1.0  # Задержка между запросами в секундах
    
    # Кеширование
    CACHE_TTL_ANIME: int = 3600  # 1 час
    CACHE_TTL_EPISODES: int = 1800  # 30 минут
    CACHE_TTL_VIDEO_SOURCES: int = 900  # 15 минут
    
    class Config:
        env_file = ".env"


settings = Settings()
