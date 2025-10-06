"""
Базовый класс для всех парсеров AniStand
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import aiohttp
import asyncio
from loguru import logger


@dataclass
class AnimeMetadata:
    """Метаданные аниме"""
    id: Optional[int] = None
    title_romaji: Optional[str] = None
    title_english: Optional[str] = None
    title_native: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    banner_image: Optional[str] = None
    episodes: Optional[int] = None
    duration: Optional[int] = None
    status: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    season: Optional[str] = None
    season_year: Optional[int] = None
    genres: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    rating: Optional[float] = None
    popularity: Optional[int] = None
    source: Optional[str] = None


@dataclass
class EpisodeData:
    """Данные эпизода"""
    number: int
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    duration: Optional[int] = None
    air_date: Optional[str] = None


@dataclass
class VideoSource:
    """Источник видео"""
    url: str
    quality: str  # 720p, 1080p, etc.
    type: str     # mp4, hls, etc.
    server: str   # server name
    headers: Optional[Dict[str, str]] = None


class BaseParser(ABC):
    """Базовый класс для всех парсеров"""
    
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.base_headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(headers=self.base_headers)
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    @abstractmethod
    async def search_anime(self, query: str, limit: int = 20) -> List[AnimeMetadata]:
        """Поиск аниме по запросу"""
        pass
    
    @abstractmethod
    async def get_anime_metadata(self, anime_id: str) -> Optional[AnimeMetadata]:
        """Получение метаданных аниме по ID"""
        pass
    
    @abstractmethod
    async def get_episodes(self, anime_id: str) -> List[EpisodeData]:
        """Получение списка эпизодов"""
        pass
    
    @abstractmethod
    async def get_video_sources(self, anime_id: str, episode: int) -> List[VideoSource]:
        """Получение источников видео для эпизода"""
        pass
    
    async def make_request(self, url: str, method: str = 'GET', **kwargs) -> Optional[Any]:
        """Базовый метод для HTTP запросов"""
        try:
            if not self.session:
                raise RuntimeError("Session not initialized. Use async context manager.")
            
            async with self.session.request(method, url, **kwargs) as response:
                if response.status == 200:
                    content_type = response.headers.get('content-type', '')
                    if 'application/json' in content_type:
                        return await response.json()
                    else:
                        return await response.text()
                else:
                    logger.warning(f"Request failed: {url} - Status: {response.status}")
                    return None
        
        except asyncio.TimeoutError:
            logger.error(f"Timeout for request: {url}")
            return None
        except Exception as e:
            logger.error(f"Error making request to {url}: {e}")
            return None
    
    def clean_text(self, text: str) -> str:
        """Очистка текста от HTML тегов и лишних символов"""
        if not text:
            return ""
        
        # Удаление HTML тегов
        import re
        text = re.sub(r'<[^>]+>', '', text)
        
        # Удаление лишних пробелов
        text = ' '.join(text.split())
        
        return text.strip()
    
    def extract_year(self, date_str: str) -> Optional[int]:
        """Извлечение года из строки даты"""
        if not date_str:
            return None
        
        import re
        year_match = re.search(r'(\d{4})', date_str)
        return int(year_match.group(1)) if year_match else None
