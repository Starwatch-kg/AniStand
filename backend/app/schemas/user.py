from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = Field(None, max_length=500)


class UserInDB(UserBase):
    id: int
    avatar_url: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class User(UserInDB):
    pass


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class UserRegisterResponse(BaseModel):
    user: User
    access_token: str
    token_type: str = "bearer"


class UserFavoriteCreate(BaseModel):
    anime_id: int


class UserFavorite(BaseModel):
    anime_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class WatchHistoryCreate(BaseModel):
    episode_id: int
    progress: int = Field(0, ge=0)
    completed: bool = False


class WatchHistory(BaseModel):
    id: int
    episode_id: int
    progress: int
    completed: bool
    watched_at: datetime

    class Config:
        from_attributes = True


class RatingCreate(BaseModel):
    anime_id: int
    score: int = Field(..., ge=1, le=10)


class Rating(BaseModel):
    anime_id: int
    score: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
