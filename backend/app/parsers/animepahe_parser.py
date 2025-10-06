from typing import List, Dict, Optional
import re
from urllib.parse import urljoin
from loguru import logger

from .base_parser import BaseParser


class AnimePaheParser(BaseParser):
    """Парсер для Animepahe (источник видео)"""
    
    BASE_URL = "https://animepahe.com"
    API_URL = "https://animepahe.com/api"
    
    async def get_anime_metadata(self, anime_id: str) -> Optional[Dict]:
        """Получить метаданные аниме из Animepahe"""
        
        url = f"{self.API_URL}?m=release&id={anime_id}"
        
        try:
            data = await self._make_request(url)
            if not data or "data" not in data:
                return None
            
            anime_data = data["data"][0] if data["data"] else None
            if not anime_data:
                return None
            
            return self._format_anime_data(anime_data)
            
        except Exception as e:
            logger.error(f"Error fetching anime from Animepahe: {str(e)}")
            return None
    
    async def search_anime(self, query: str, limit: int = 10) -> List[Dict]:
        """Поиск аниме в Animepahe"""
        
        url = f"{self.API_URL}?m=search&q={query}"
        
        try:
            data = await self._make_request(url)
            if not data or "data" not in data:
                return []
            
            results = []
            for anime in data["data"][:limit]:
                formatted = self._format_anime_data(anime)
                if formatted:
                    results.append(formatted)
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching anime in Animepahe: {str(e)}")
            return []
    
    async def get_episodes(self, anime_id: str) -> List[Dict]:
        """Получить список эпизодов из Animepahe"""
        
        url = f"{self.API_URL}?m=release&id={anime_id}&sort=episode_asc"
        
        try:
            data = await self._make_request(url)
            if not data or "data" not in data:
                return []
            
            episodes = []
            for episode_data in data["data"]:
                episode = self._format_episode_data(episode_data)
                if episode:
                    episodes.append(episode)
            
            return episodes
            
        except Exception as e:
            logger.error(f"Error fetching episodes from Animepahe: {str(e)}")
            return []
    
    async def get_video_sources(self, episode_id: str) -> List[Dict]:
        """Получить источники видео для эпизода"""
        
        # Получаем ссылки на плееры
        url = f"{self.API_URL}?m=links&id={episode_id}"
        
        try:
            data = await self._make_request(url)
            if not data or "data" not in data:
                return []
            
            sources = []
            for link_data in data["data"]:
                # Получаем прямые ссылки на видео
                video_sources = await self._extract_video_urls(link_data)
                sources.extend(video_sources)
            
            return sources
            
        except Exception as e:
            logger.error(f"Error fetching video sources from Animepahe: {str(e)}")
            return []
    
    async def _extract_video_urls(self, link_data: Dict) -> List[Dict]:
        """Извлечь прямые ссылки на видео из данных плеера"""
        
        sources = []
        
        try:
            # Animepahe использует различные плееры (kwik, mp4upload и др.)
            fid = link_data.get("fid")
            audio = link_data.get("audio", "jpn")
            
            if not fid:
                return sources
            
            # Получаем данные плеера
            player_url = f"{self.API_URL}?m=embed&id={fid}"
            player_data = await self._make_request(player_url)
            
            if player_data and "data" in player_data:
                for quality_data in player_data["data"]:
                    source = {
                        "source_name": "animepahe",
                        "video_url": quality_data.get("kwik"),  # Основной источник
                        "quality": quality_data.get("quality", "720p"),
                        "subtitle_url": None,  # Animepahe обычно не предоставляет субтитры отдельно
                        "is_active": True
                    }
                    
                    if source["video_url"]:
                        sources.append(source)
            
        except Exception as e:
            logger.error(f"Error extracting video URLs: {str(e)}")
        
        return sources
    
    def _format_anime_data(self, anime_data: Dict) -> Dict:
        """Форматировать данные аниме в стандартный формат"""
        
        return {
            "animepahe_id": anime_data.get("id"),
            "title_romaji": anime_data.get("title"),
            "title_english": anime_data.get("title"),  # Animepahe обычно использует один заголовок
            "title_native": None,
            "description": self._clean_text(anime_data.get("synopsis", "")),
            "cover_image": anime_data.get("poster"),
            "banner_image": None,
            "episodes": anime_data.get("episodes"),
            "duration": None,  # Animepahe не всегда предоставляет длительность
            "status": anime_data.get("status"),
            "start_date": None,  # Требует дополнительного парсинга
            "end_date": None,
            "season": anime_data.get("season"),
            "season_year": anime_data.get("year"),
            "average_score": None,
            "popularity": None,
            "is_adult": False,  # Animepahe фильтрует контент
            "genres": [],  # Требует дополнительного парсинга
            "studios": [],
            "source": "animepahe"
        }
    
    def _format_episode_data(self, episode_data: Dict) -> Dict:
        """Форматировать данные эпизода в стандартный формат"""
        
        return {
            "animepahe_episode_id": episode_data.get("id"),
            "episode_number": episode_data.get("episode"),
            "title": episode_data.get("title"),
            "description": None,
            "air_date": None,  # Требует парсинга created_at
            "duration": episode_data.get("duration"),  # В секундах
            "thumbnail": episode_data.get("snapshot")
        }
