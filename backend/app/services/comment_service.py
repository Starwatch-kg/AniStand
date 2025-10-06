from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import List, Optional
import math

from app.models.comment import Comment
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentUpdate, CommentList


class CommentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_anime_comments(self, anime_id: int, page: int = 1, limit: int = 20) -> CommentList:
        """Получить комментарии к аниме с пагинацией"""
        
        # Получаем только родительские комментарии (без ответов)
        query = select(Comment).where(
            and_(
                Comment.anime_id == anime_id,
                Comment.parent_id.is_(None)
            )
        ).options(
            selectinload(Comment.user),
            selectinload(Comment.replies).selectinload(Comment.user)
        ).order_by(Comment.created_at.desc())
        
        # Подсчет общего количества
        count_query = select(func.count(Comment.id)).where(
            and_(
                Comment.anime_id == anime_id,
                Comment.parent_id.is_(None)
            )
        )
        
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Пагинация
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)
        
        result = await self.db.execute(query)
        comments = result.scalars().all()
        
        # Преобразуем в схему с информацией о пользователе
        comment_list = []
        for comment in comments:
            comment_dict = {
                "id": comment.id,
                "user_id": comment.user_id,
                "anime_id": comment.anime_id,
                "episode_id": comment.episode_id,
                "content": comment.content,
                "parent_id": comment.parent_id,
                "created_at": comment.created_at,
                "updated_at": comment.updated_at,
                "user": {
                    "id": comment.user.id,
                    "username": comment.user.username,
                    "avatar_url": comment.user.avatar_url
                },
                "replies": [
                    {
                        "id": reply.id,
                        "user_id": reply.user_id,
                        "anime_id": reply.anime_id,
                        "episode_id": reply.episode_id,
                        "content": reply.content,
                        "parent_id": reply.parent_id,
                        "created_at": reply.created_at,
                        "updated_at": reply.updated_at,
                        "user": {
                            "id": reply.user.id,
                            "username": reply.user.username,
                            "avatar_url": reply.user.avatar_url
                        },
                        "replies": []
                    }
                    for reply in comment.replies
                ]
            }
            comment_list.append(comment_dict)
        
        return CommentList(
            data=comment_list,
            total=total,
            page=page,
            limit=limit
        )

    async def get_episode_comments(self, episode_id: int, page: int = 1, limit: int = 20) -> CommentList:
        """Получить комментарии к эпизоду с пагинацией"""
        
        query = select(Comment).where(
            and_(
                Comment.episode_id == episode_id,
                Comment.parent_id.is_(None)
            )
        ).options(
            selectinload(Comment.user),
            selectinload(Comment.replies).selectinload(Comment.user)
        ).order_by(Comment.created_at.desc())
        
        count_query = select(func.count(Comment.id)).where(
            and_(
                Comment.episode_id == episode_id,
                Comment.parent_id.is_(None)
            )
        )
        
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)
        
        result = await self.db.execute(query)
        comments = result.scalars().all()
        
        comment_list = []
        for comment in comments:
            comment_dict = {
                "id": comment.id,
                "user_id": comment.user_id,
                "anime_id": comment.anime_id,
                "episode_id": comment.episode_id,
                "content": comment.content,
                "parent_id": comment.parent_id,
                "created_at": comment.created_at,
                "updated_at": comment.updated_at,
                "user": {
                    "id": comment.user.id,
                    "username": comment.user.username,
                    "avatar_url": comment.user.avatar_url
                },
                "replies": [
                    {
                        "id": reply.id,
                        "user_id": reply.user_id,
                        "anime_id": reply.anime_id,
                        "episode_id": reply.episode_id,
                        "content": reply.content,
                        "parent_id": reply.parent_id,
                        "created_at": reply.created_at,
                        "updated_at": reply.updated_at,
                        "user": {
                            "id": reply.user.id,
                            "username": reply.user.username,
                            "avatar_url": reply.user.avatar_url
                        },
                        "replies": []
                    }
                    for reply in comment.replies
                ]
            }
            comment_list.append(comment_dict)
        
        return CommentList(
            data=comment_list,
            total=total,
            page=page,
            limit=limit
        )

    async def create_comment(self, user_id: int, comment_data: CommentCreate) -> Comment:
        """Создать комментарий"""
        comment = Comment(
            user_id=user_id,
            anime_id=comment_data.anime_id,
            episode_id=comment_data.episode_id,
            content=comment_data.content,
            parent_id=comment_data.parent_id
        )
        
        self.db.add(comment)
        await self.db.commit()
        await self.db.refresh(comment)
        
        # Загружаем пользователя для ответа
        await self.db.refresh(comment, ["user"])
        
        return comment

    async def update_comment(
        self, 
        comment_id: int, 
        user_id: int, 
        comment_data: CommentUpdate
    ) -> Optional[Comment]:
        """Обновить комментарий (только автор)"""
        
        result = await self.db.execute(
            select(Comment).where(
                and_(
                    Comment.id == comment_id,
                    Comment.user_id == user_id
                )
            )
        )
        comment = result.scalar_one_or_none()
        
        if not comment:
            return None
        
        if comment_data.content:
            comment.content = comment_data.content
        
        await self.db.commit()
        await self.db.refresh(comment)
        
        return comment

    async def delete_comment(self, comment_id: int, user_id: int) -> bool:
        """Удалить комментарий (только автор)"""
        
        result = await self.db.execute(
            select(Comment).where(
                and_(
                    Comment.id == comment_id,
                    Comment.user_id == user_id
                )
            )
        )
        comment = result.scalar_one_or_none()
        
        if not comment:
            return False
        
        await self.db.delete(comment)
        await self.db.commit()
        
        return True
