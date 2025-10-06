from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.schemas.user import (
    User as UserSchema, UserUpdate, UserFavoriteCreate, 
    WatchHistory, Rating, RatingCreate
)
from app.schemas.anime import Anime as AnimeSchema
from app.services.user_service import UserService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Получить информацию о текущем пользователе"""
    return current_user


@router.put("/me", response_model=UserSchema)
async def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Обновить информацию о текущем пользователе"""
    
    user_service = UserService(db)
    updated_user = await user_service.update_user(current_user.id, user_data)
    
    return updated_user


@router.post("/favorites")
async def add_to_favorites(
    favorite_data: UserFavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Добавить аниме в избранное"""
    
    user_service = UserService(db)
    await user_service.add_to_favorites(current_user.id, favorite_data.anime_id)
    
    return {"message": "Added to favorites"}


@router.delete("/favorites/{anime_id}")
async def remove_from_favorites(
    anime_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Удалить аниме из избранного"""
    
    user_service = UserService(db)
    success = await user_service.remove_from_favorites(current_user.id, anime_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    return {"message": "Removed from favorites"}


@router.get("/favorites", response_model=List[AnimeSchema])
async def get_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить список избранного аниме"""
    
    user_service = UserService(db)
    favorites = await user_service.get_user_favorites(current_user.id)
    
    return favorites


@router.get("/history", response_model=List[WatchHistory])
async def get_watch_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить историю просмотров"""
    
    user_service = UserService(db)
    history = await user_service.get_watch_history(current_user.id)
    
    return history


@router.post("/ratings")
async def rate_anime(
    rating_data: RatingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Оценить аниме"""
    
    user_service = UserService(db)
    await user_service.rate_anime(
        user_id=current_user.id,
        anime_id=rating_data.anime_id,
        score=rating_data.score
    )
    
    return {"message": "Rating saved"}


@router.get("/ratings", response_model=List[Rating])
async def get_user_ratings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить рейтинги пользователя"""
    
    user_service = UserService(db)
    ratings = await user_service.get_user_ratings(current_user.id)
    
    return ratings
