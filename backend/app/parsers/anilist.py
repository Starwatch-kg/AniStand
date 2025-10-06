"""
AniList API парсер для получения метаданных аниме
"""
from typing import Dict, List, Optional
from .base import BaseParser, AnimeMetadata, EpisodeData, VideoSource
from loguru import logger


class AniListParser(BaseParser):
    """Парсер для AniList GraphQL API"""
    
    def __init__(self):
        super().__init__()
        self.api_url = "https://graphql.anilist.co"
    
    async def search_anime(self, query: str, limit: int = 20) -> List[AnimeMetadata]:
        """Поиск аниме через AniList API"""
        graphql_query = """
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
                    genres
                    tags {
                        name
                    }
                    averageScore
                    popularity
                    source
                }
            }
        }
        """
        
        variables = {
            "search": query,
            "perPage": limit
        }
        
        response = await self.make_request(
            self.api_url,
            method='POST',
            json={
                'query': graphql_query,
                'variables': variables
            }
        )
        
        if not response or 'data' not in response:
            logger.error(f"Failed to search anime: {query}")
            return []
        
        anime_list = []
        for media in response['data']['Page']['media']:
            anime = self._parse_anime_data(media)
            if anime:
                anime_list.append(anime)
        
        return anime_list
    
    async def get_anime_metadata(self, anime_id: str) -> Optional[AnimeMetadata]:
        """Получение детальной информации об аниме"""
        graphql_query = """
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
                genres
                tags {
                    name
                }
                averageScore
                popularity
                source
                studios {
                    nodes {
                        name
                    }
                }
                trailer {
                    id
                    site
                }
            }
        }
        """
        
        try:
            anime_id_int = int(anime_id)
        except ValueError:
            logger.error(f"Invalid anime ID: {anime_id}")
            return None
        
        variables = {"id": anime_id_int}
        
        response = await self.make_request(
            self.api_url,
            method='POST',
            json={
                'query': graphql_query,
                'variables': variables
            }
        )
        
        if not response or 'data' not in response or not response['data']['Media']:
            logger.error(f"Failed to get anime metadata: {anime_id}")
            return None
        
        return self._parse_anime_data(response['data']['Media'])
    
    async def get_episodes(self, anime_id: str) -> List[EpisodeData]:
        """AniList не предоставляет детальную информацию об эпизодах"""
        # Получаем базовую информацию об аниме
        anime = await self.get_anime_metadata(anime_id)
        if not anime or not anime.episodes:
            return []
        
        # Создаем базовые данные эпизодов
        episodes = []
        for i in range(1, anime.episodes + 1):
            episode = EpisodeData(
                number=i,
                title=f"Episode {i}",
                description=None,
                thumbnail=None,
                duration=anime.duration,
                air_date=None
            )
            episodes.append(episode)
        
        return episodes
    
    async def get_video_sources(self, anime_id: str, episode: int) -> List[VideoSource]:
        """AniList не предоставляет видео источники"""
        logger.warning("AniList does not provide video sources")
        return []
    
    def _parse_anime_data(self, media_data: Dict) -> Optional[AnimeMetadata]:
        """Парсинг данных аниме из AniList ответа"""
        try:
            # Парсинг дат
            start_date = self._parse_date(media_data.get('startDate'))
            end_date = self._parse_date(media_data.get('endDate'))
            
            # Парсинг тегов
            tags = []
            if media_data.get('tags'):
                tags = [tag['name'] for tag in media_data['tags']]
            
            # Очистка описания
            description = media_data.get('description', '')
            if description:
                description = self.clean_text(description)
            
            anime = AnimeMetadata(
                id=media_data.get('id'),
                title_romaji=media_data.get('title', {}).get('romaji'),
                title_english=media_data.get('title', {}).get('english'),
                title_native=media_data.get('title', {}).get('native'),
                description=description,
                cover_image=media_data.get('coverImage', {}).get('large'),
                banner_image=media_data.get('bannerImage'),
                episodes=media_data.get('episodes'),
                duration=media_data.get('duration'),
                status=media_data.get('status'),
                start_date=start_date,
                end_date=end_date,
                season=media_data.get('season'),
                season_year=media_data.get('seasonYear'),
                genres=media_data.get('genres', []),
                tags=tags,
                rating=media_data.get('averageScore'),
                popularity=media_data.get('popularity'),
                source=media_data.get('source')
            )
            
            return anime
            
        except Exception as e:
            logger.error(f"Error parsing anime data: {e}")
            return None
    
    def _parse_date(self, date_data: Optional[Dict]) -> Optional[str]:
        """Парсинг даты из AniList формата"""
        if not date_data:
            return None
        
        year = date_data.get('year')
        month = date_data.get('month')
        day = date_data.get('day')
        
        if not year:
            return None
        
        # Формат: YYYY-MM-DD
        date_str = str(year)
        if month:
            date_str += f"-{month:02d}"
            if day:
                date_str += f"-{day:02d}"
        
        return date_str
