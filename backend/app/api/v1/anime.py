"""
Anime API endpoints
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from pydantic import BaseModel
from loguru import logger

from app.parsers.anilist import AniListParser
from app.parsers.base import AnimeMetadata

router = APIRouter(prefix="/anime", tags=["anime"])


class AnimeResponse(BaseModel):
    """Ответ API для аниме"""
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


class AnimeListResponse(BaseModel):
    """Ответ для списка аниме"""
    data: List[AnimeResponse]
    total: int
    page: int
    pages: int


def metadata_to_response(metadata: AnimeMetadata) -> AnimeResponse:
    """Конвертация AnimeMetadata в AnimeResponse"""
    return AnimeResponse(
        id=metadata.id,
        title_romaji=metadata.title_romaji,
        title_english=metadata.title_english,
        title_native=metadata.title_native,
        description=metadata.description,
        cover_image=metadata.cover_image,
        banner_image=metadata.banner_image,
        episodes=metadata.episodes,
        duration=metadata.duration,
        status=metadata.status,
        start_date=metadata.start_date,
        end_date=metadata.end_date,
        season=metadata.season,
        season_year=metadata.season_year,
        genres=metadata.genres or [],
        tags=metadata.tags or [],
        rating=metadata.rating,
        popularity=metadata.popularity,
        source=metadata.source
    )


@router.get("/", response_model=AnimeListResponse)
async def get_anime_list(
    page: int = Query(1, ge=1, description="Номер страницы"),
    limit: int = Query(20, ge=1, le=100, description="Количество элементов на странице"),
    search: Optional[str] = Query(None, description="Поисковый запрос"),
    genre: Optional[str] = Query(None, description="Фильтр по жанру"),
    year: Optional[int] = Query(None, description="Фильтр по году"),
    status: Optional[str] = Query(None, description="Фильтр по статусу"),
    sort: str = Query("popularity", description="Сортировка")
):
    """Получение списка аниме с фильтрами"""
    try:
        # Если есть поисковый запрос, используем AniList
        if search:
            async with AniListParser() as parser:
                anime_list = await parser.search_anime(search, limit)
                
                anime_responses = [metadata_to_response(anime) for anime in anime_list]
                
                return AnimeListResponse(
                    data=anime_responses,
                    total=len(anime_responses),
                    page=page,
                    pages=1
                )
        
        # Иначе возвращаем mock данные
        mock_anime = [
            AnimeResponse(
                id=1,
                title_romaji="Shingeki no Kyojin",
                title_english="Attack on Titan",
                description="Humanity fights for survival against giant humanoid Titans.",
                cover_image="https://via.placeholder.com/300x400",
                banner_image="https://via.placeholder.com/800x300",
                episodes=25,
                duration=24,
                status="FINISHED",
                season="SPRING",
                season_year=2013,
                genres=["Action", "Drama", "Fantasy"],
                rating=90.0,
                popularity=95000
            ),
            AnimeResponse(
                id=2,
                title_romaji="Kimetsu no Yaiba",
                title_english="Demon Slayer",
                description="A young boy becomes a demon slayer to save his sister.",
                cover_image="https://via.placeholder.com/300x400",
                banner_image="https://via.placeholder.com/800x300",
                episodes=26,
                duration=23,
                status="FINISHED",
                season="SPRING",
                season_year=2019,
                genres=["Action", "Supernatural"],
                rating=87.0,
                popularity=89000
            )
        ]
        
        return AnimeListResponse(
            data=mock_anime,
            total=len(mock_anime),
            page=page,
            pages=1
        )
        
    except Exception as e:
        logger.error(f"Error getting anime list: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{anime_id}", response_model=AnimeResponse)
async def get_anime_detail(anime_id: int):
    """Получение детальной информации об аниме"""
    try:
        # Пробуем получить данные из AniList
        async with AniListParser() as parser:
            anime = await parser.get_anime_metadata(str(anime_id))
            
            if anime:
                return metadata_to_response(anime)
        
        # Если не найдено в AniList, возвращаем mock данные
        if anime_id == 1:
            return AnimeResponse(
                id=1,
                title_romaji="Shingeki no Kyojin",
                title_english="Attack on Titan",
                description="Humanity fights for survival against giant humanoid Titans that have brought humanity to the brink of extinction.",
                cover_image="https://via.placeholder.com/300x400",
                banner_image="https://via.placeholder.com/800x300",
                episodes=25,
                duration=24,
                status="FINISHED",
                season="SPRING",
                season_year=2013,
                genres=["Action", "Drama", "Fantasy"],
                rating=90.0,
                popularity=95000
            )
        
        raise HTTPException(status_code=404, detail="Anime not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting anime detail: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/search", response_model=AnimeListResponse)
async def search_anime(
    q: str = Query(..., description="Поисковый запрос"),
    limit: int = Query(20, ge=1, le=100, description="Количество результатов")
):
    """Поиск аниме по названию"""
    try:
        async with AniListParser() as parser:
            anime_list = await parser.search_anime(q, limit)
            
            anime_responses = [metadata_to_response(anime) for anime in anime_list]
            
            return AnimeListResponse(
                data=anime_responses,
                total=len(anime_responses),
                page=1,
                pages=1
            )
            
    except Exception as e:
        logger.error(f"Error searching anime: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/genres", response_model=List[dict])
async def get_genres():
    """Получение списка жанров"""
    # Стандартные жанры аниме
    genres = [
        {"id": 1, "name": "Action"},
        {"id": 2, "name": "Adventure"},
        {"id": 3, "name": "Comedy"},
        {"id": 4, "name": "Drama"},
        {"id": 5, "name": "Ecchi"},
        {"id": 6, "name": "Fantasy"},
        {"id": 7, "name": "Horror"},
        {"id": 8, "name": "Mahou Shoujo"},
        {"id": 9, "name": "Mecha"},
        {"id": 10, "name": "Music"},
        {"id": 11, "name": "Mystery"},
        {"id": 12, "name": "Psychological"},
        {"id": 13, "name": "Romance"},
        {"id": 14, "name": "Sci-Fi"},
        {"id": 15, "name": "Slice of Life"},
        {"id": 16, "name": "Sports"},
        {"id": 17, "name": "Supernatural"},
        {"id": 18, "name": "Thriller"}
    ]
    
    return genres
