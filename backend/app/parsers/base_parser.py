from abc import ABC, abstractmethod
from typing import List, Dict, Optional
import asyncio
import aiohttp
from loguru import logger

from app.config import settings


class BaseParser(ABC):
    """Базовый класс для всех парсеров"""
    
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.headers = {
            'User-Agent': settings.PARSER_USER_AGENT
        }
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            headers=self.headers,
            timeout=aiohttp.ClientTimeout(total=30)
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    async def _make_request(self, url: str, **kwargs) -> Optional[Dict]:
        """Выполнить HTTP запрос с обработкой ошибок"""
        try:
            if not self.session:
                raise RuntimeError("Parser session not initialized. Use async context manager.")
            
            # Добавляем задержку между запросами
            await asyncio.sleep(settings.PARSER_DELAY)
            
            async with self.session.get(url, **kwargs) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    logger.warning(f"Request failed with status {response.status}: {url}")
                    return None
                    
        except asyncio.TimeoutError:
            logger.error(f"Request timeout: {url}")
            return None
        except Exception as e:
            logger.error(f"Request error for {url}: {str(e)}")
            return None
    
    @abstractmethod
    async def get_anime_metadata(self, anime_id: str) -> Optional[Dict]:
        """Получить метаданные аниме"""
        pass
    
    @abstractmethod
    async def get_episodes(self, anime_id: str) -> List[Dict]:
        """Получить список эпизодов"""
        pass
    
    @abstractmethod
    async def get_video_sources(self, episode_id: str) -> List[Dict]:
        """Получить источники видео для эпизода"""
        pass
    
    async def search_anime(self, query: str, limit: int = 10) -> List[Dict]:
        """Поиск аниме (базовая реализация)"""
        logger.warning(f"Search not implemented for {self.__class__.__name__}")
        return []
    
    def _clean_text(self, text: str) -> str:
        """Очистить текст от HTML тегов и лишних символов"""
        if not text:
            return ""
        
        # Простая очистка HTML тегов
        import re
        text = re.sub(r'<[^>]+>', '', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def _safe_get(self, data: Dict, key: str, default=None):
        """Безопасное получение значения из словаря"""
        try:
            keys = key.split('.')
            result = data
            for k in keys:
                result = result[k]
            return result
        except (KeyError, TypeError):
            return default
