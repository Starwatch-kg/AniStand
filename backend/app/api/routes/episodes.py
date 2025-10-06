from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.schemas.episode import (
    Episode, EpisodeCreate, EpisodeUpdate, EpisodeList,
    EpisodeSourcesResponse, WatchProgressUpdate
)
from app.services.episode_service import EpisodeService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/anime/{anime_id}", response_model=EpisodeList)
async def get_anime_episodes(
    anime_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Получить список эпизодов для аниме"""
    
    episode_service = EpisodeService(db)
    episodes = await episode_service.get_episodes_by_anime(anime_id)
    
    return {
        "data": episodes,
        "total": len(episodes)
    }


@router.get("/{episode_id}", response_model=Episode)
async def get_episode_detail(
    episode_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Получить детальную информацию об эпизоде"""
    
    episode_service = EpisodeService(db)
    episode = await episode_service.get_episode_by_id(episode_id)
    
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    return episode


@router.get("/{episode_id}/sources", response_model=EpisodeSourcesResponse)
async def get_episode_sources(
    episode_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить ссылки на видео для эпизода (требует авторизации)"""
    
    episode_service = EpisodeService(db)
    episode = await episode_service.get_episode_by_id(episode_id)
    
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    # Получаем активные источники видео
    sources = await episode_service.get_active_video_sources(episode_id)
    
    return {
        "episode_id": episode_id,
        "sources": sources
    }


@router.post("/{episode_id}/progress")
async def save_watch_progress(
    episode_id: int,
    progress_data: WatchProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Сохранить прогресс просмотра эпизода"""
    
    episode_service = EpisodeService(db)
    
    # Проверяем существование эпизода
    episode = await episode_service.get_episode_by_id(episode_id)
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    # Сохраняем прогресс
    await episode_service.save_watch_progress(
        user_id=current_user.id,
        episode_id=episode_id,
        progress=progress_data.progress,
        completed=progress_data.completed
    )
    
    return {"message": "Progress saved successfully"}


@router.post("/", response_model=Episode)
async def create_episode(
    episode_data: EpisodeCreate,
    db: AsyncSession = Depends(get_db)
):
    """Создать новый эпизод (для админов)"""
    
    episode_service = EpisodeService(db)
    episode = await episode_service.create_episode(episode_data)
    
    return episode


@router.put("/{episode_id}", response_model=Episode)
async def update_episode(
    episode_id: int,
    episode_data: EpisodeUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Обновить информацию об эпизоде (для админов)"""
    
    episode_service = EpisodeService(db)
    episode = await episode_service.update_episode(episode_id, episode_data)
    
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    return episode


@router.delete("/{episode_id}")
async def delete_episode(
    episode_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Удалить эпизод (для админов)"""
    
    episode_service = EpisodeService(db)
    success = await episode_service.delete_episode(episode_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    return {"message": "Episode deleted successfully"}
