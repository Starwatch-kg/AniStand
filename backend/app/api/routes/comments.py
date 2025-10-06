from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.schemas.comment import Comment, CommentCreate, CommentUpdate, CommentList
from app.services.comment_service import CommentService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/anime/{anime_id}", response_model=CommentList)
async def get_anime_comments(
    anime_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Получить комментарии к аниме"""
    
    comment_service = CommentService(db)
    result = await comment_service.get_anime_comments(anime_id, page, limit)
    
    return result


@router.get("/episode/{episode_id}", response_model=CommentList)
async def get_episode_comments(
    episode_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Получить комментарии к эпизоду"""
    
    comment_service = CommentService(db)
    result = await comment_service.get_episode_comments(episode_id, page, limit)
    
    return result


@router.post("/", response_model=Comment)
async def create_comment(
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Создать комментарий"""
    
    comment_service = CommentService(db)
    comment = await comment_service.create_comment(current_user.id, comment_data)
    
    return comment


@router.put("/{comment_id}", response_model=Comment)
async def update_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Обновить комментарий (только автор)"""
    
    comment_service = CommentService(db)
    comment = await comment_service.update_comment(comment_id, current_user.id, comment_data)
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found or access denied")
    
    return comment


@router.delete("/{comment_id}")
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Удалить комментарий (только автор)"""
    
    comment_service = CommentService(db)
    success = await comment_service.delete_comment(comment_id, current_user.id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found or access denied")
    
    return {"message": "Comment deleted successfully"}
