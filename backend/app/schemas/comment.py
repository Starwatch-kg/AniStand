from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    parent_id: Optional[int] = None


class CommentCreate(CommentBase):
    anime_id: int
    episode_id: Optional[int] = None


class CommentUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=2000)


class CommentInDB(CommentBase):
    id: int
    user_id: int
    anime_id: int
    episode_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Comment(CommentInDB):
    user: dict  # Будет содержать информацию о пользователе
    replies: List["Comment"] = []


class CommentList(BaseModel):
    data: List[Comment]
    total: int
    page: int
    limit: int


# Обновляем модель для поддержки рекурсивных ссылок
Comment.model_rebuild()
