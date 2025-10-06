from typing import List, Dict, Optional
import aiohttp
from loguru import logger

from .base_parser import BaseParser


class AniListParser(BaseParser):
    """Парсер для AniList GraphQL API"""
    
    BASE_URL = "https://graphql.anilist.co"
    
    async def get_anime_metadata(self, anime_id: str) -> Optional[Dict]:
        """Получить метаданные аниме из AniList"""
        
        query = """
        query ($id: Int) {
            Media(id: $id, type: ANIME) {
                id
                title {
                    romaji
                    english
                    native
                }
                description
                coverImage {
                    large
                    medium
                }
                bannerImage
                episodes
                duration
                status
                startDate {
                    year
                    month
                    day
                }
                endDate {
                    year
                    month
                    day
                }
                season
                seasonYear
                averageScore
                popularity
                isAdult
                genres
                studios {
                    nodes {
                        name
                    }
                }
                source
                format
            }
        }
        """
        
        variables = {"id": int(anime_id)}
        
        try:
            async with self.session.post(
                self.BASE_URL,
                json={"query": query, "variables": variables}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if "errors" in data:
                        logger.error(f"AniList API error: {data['errors']}")
                        return None
                    
                    media = data.get("data", {}).get("Media")
                    if not media:
                        return None
                    
                    return self._format_anime_data(media)
                else:
                    logger.error(f"AniList request failed: {response.status}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error fetching anime metadata from AniList: {str(e)}")
            return None
    
    async def search_anime(self, query: str, limit: int = 10) -> List[Dict]:
        """Поиск аниме в AniList"""
        
        search_query = """
        query ($search: String, $perPage: Int) {
            Page(page: 1, perPage: $perPage) {
                media(search: $search, type: ANIME) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    description
                    coverImage {
                        large
                        medium
                    }
                    episodes
                    status
                    averageScore
                    popularity
                    seasonYear
                    genres
                    studios {
                        nodes {
                            name
                        }
                    }
                }
            }
        }
        """
        
        variables = {"search": query, "perPage": limit}
        
        try:
            async with self.session.post(
                self.BASE_URL,
                json={"query": search_query, "variables": variables}
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if "errors" in data:
                        logger.error(f"AniList search error: {data['errors']}")
                        return []
                    
                    media_list = data.get("data", {}).get("Page", {}).get("media", [])
                    return [self._format_anime_data(media) for media in media_list]
                else:
                    logger.error(f"AniList search failed: {response.status}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error searching anime in AniList: {str(e)}")
            return []
    
    async def get_episodes(self, anime_id: str) -> List[Dict]:
        """Получить список эпизодов (AniList не предоставляет детальную информацию об эпизодах)"""
        # AniList не предоставляет детальную информацию об эпизодах
        # Возвращаем базовую структуру на основе количества эпизодов
        
        anime_data = await self.get_anime_metadata(anime_id)
        if not anime_data or not anime_data.get("episodes"):
            return []
        
        episodes = []
        episode_count = anime_data["episodes"]
        
        for i in range(1, episode_count + 1):
            episodes.append({
                "episode_number": i,
                "title": f"Episode {i}",
                "description": None,
                "air_date": None,
                "duration": anime_data.get("duration", 24) * 60,  # Конвертируем в секунды
                "thumbnail": None
            })
        
        return episodes
    
    async def get_video_sources(self, episode_id: str) -> List[Dict]:
        """Получить источники видео (AniList не предоставляет видео)"""
        # AniList не предоставляет прямые ссылки на видео
        return []
    
    def _format_anime_data(self, media: Dict) -> Dict:
        """Форматировать данные аниме в стандартный формат"""
        
        # Форматируем дату
        start_date = None
        if media.get("startDate"):
            start_date_obj = media["startDate"]
            if all(start_date_obj.get(key) for key in ["year", "month", "day"]):
                start_date = f"{start_date_obj['year']}-{start_date_obj['month']:02d}-{start_date_obj['day']:02d}"
        
        end_date = None
        if media.get("endDate"):
            end_date_obj = media["endDate"]
            if all(end_date_obj.get(key) for key in ["year", "month", "day"]):
                end_date = f"{end_date_obj['year']}-{end_date_obj['month']:02d}-{end_date_obj['day']:02d}"
        
        # Извлекаем названия студий
        studios = []
        if media.get("studios", {}).get("nodes"):
            studios = [studio["name"] for studio in media["studios"]["nodes"]]
        
        return {
            "anilist_id": media.get("id"),
            "title_romaji": self._safe_get(media, "title.romaji"),
            "title_english": self._safe_get(media, "title.english"),
            "title_native": self._safe_get(media, "title.native"),
            "description": self._clean_text(media.get("description", "")),
            "cover_image": self._safe_get(media, "coverImage.large"),
            "banner_image": media.get("bannerImage"),
            "episodes": media.get("episodes"),
            "duration": media.get("duration"),  # в минутах
            "status": media.get("status"),
            "start_date": start_date,
            "end_date": end_date,
            "season": media.get("season"),
            "season_year": media.get("seasonYear"),
            "average_score": media.get("averageScore"),
            "popularity": media.get("popularity"),
            "is_adult": media.get("isAdult", False),
            "genres": media.get("genres", []),
            "studios": studios,
            "source": "anilist"
        }
