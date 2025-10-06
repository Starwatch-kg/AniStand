from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from typing import Optional, List

from app.database import get_db
from app.models.anime import Anime, Genre, Studio
from app.schemas.anime import (
    AnimeList, Anime as AnimeSchema, AnimeCreate, AnimeUpdate, 
    AnimeFilters, AnimeSearch
)
from app.services.anime_service import AnimeService

router = APIRouter()


@router.get("/", response_model=AnimeList)
async def get_anime_list(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    genre: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    sort: str = Query("popularity", regex="^(popularity|score|year|title)$"),
    db: AsyncSession = Depends(get_db)
):
    """Получить список аниме с фильтрами и пагинацией"""
    
    anime_service = AnimeService(db)
    filters = AnimeFilters(
        genre=genre,
        year=year,
        status=status,
        sort=sort,
        page=page,
        limit=limit
    )
    
    result = await anime_service.get_anime_list(filters)
    return result


@router.get("/search", response_model=List[AnimeSchema])
async def search_anime(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Поиск аниме по названию"""
    
    anime_service = AnimeService(db)
    search_params = AnimeSearch(query=q, limit=limit)
    
    result = await anime_service.search_anime(search_params)
    return result


@router.get("/{anime_id}", response_model=AnimeSchema)
async def get_anime_detail(
    anime_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Получить детальную информацию об аниме"""
    
    anime_service = AnimeService(db)
    anime = await anime_service.get_anime_by_id(anime_id)
    
    if not anime:
        raise HTTPException(status_code=404, detail="Anime not found")
    
    return anime


@router.post("/", response_model=AnimeSchema)
async def create_anime(
    anime_data: AnimeCreate,
    db: AsyncSession = Depends(get_db)
):
    """Создать новое аниме (для админов)"""
    
    anime_service = AnimeService(db)
    anime = await anime_service.create_anime(anime_data)
    
    return anime


@router.put("/{anime_id}", response_model=AnimeSchema)
async def update_anime(
    anime_id: int,
    anime_data: AnimeUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Обновить информацию об аниме (для админов)"""
    
    anime_service = AnimeService(db)
    anime = await anime_service.update_anime(anime_id, anime_data)
    
    if not anime:
        raise HTTPException(status_code=404, detail="Anime not found")
    
    return anime


@router.delete("/{anime_id}")
async def delete_anime(
    anime_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Удалить аниме (для админов)"""
    
    anime_service = AnimeService(db)
    success = await anime_service.delete_anime(anime_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Anime not found")
    
    return {"message": "Anime deleted successfully"}


@router.get("/genres/", response_model=List[dict])
async def get_genres(db: AsyncSession = Depends(get_db)):
    """Получить список всех жанров"""
    
    result = await db.execute(select(Genre))
    genres = result.scalars().all()
    
    return [{"id": genre.id, "name": genre.name} for genre in genres]


@router.get("/studios/", response_model=List[dict])
async def get_studios(db: AsyncSession = Depends(get_db)):
    """Получить список всех студий"""
    
    result = await db.execute(select(Studio))
    studios = result.scalars().all()
    
    return [{"id": studio.id, "name": studio.name} for studio in studios]
