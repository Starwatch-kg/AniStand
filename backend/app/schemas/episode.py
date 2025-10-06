from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


class VideoSourceBase(BaseModel):
    source_name: str = Field(..., max_length=100)
    video_url: str = Field(..., max_length=1000)
    quality: Optional[str] = Field(None, max_length=20)
    subtitle_url: Optional[str] = Field(None, max_length=1000)
    is_active: bool = True


class VideoSourceCreate(VideoSourceBase):
    episode_id: int


class VideoSourceUpdate(BaseModel):
    video_url: Optional[str] = Field(None, max_length=1000)
    quality: Optional[str] = Field(None, max_length=20)
    subtitle_url: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None


class VideoSource(VideoSourceBase):
    id: int
    episode_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EpisodeBase(BaseModel):
    episode_number: int = Field(..., ge=1)
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    air_date: Optional[date] = None
    duration: Optional[int] = None  # в секундах
    thumbnail: Optional[str] = Field(None, max_length=500)


class EpisodeCreate(EpisodeBase):
    anime_id: int


class EpisodeUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    air_date: Optional[date] = None
    duration: Optional[int] = None
    thumbnail: Optional[str] = Field(None, max_length=500)


class EpisodeInDB(EpisodeBase):
    id: int
    anime_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Episode(EpisodeInDB):
    video_sources: List[VideoSource] = []


class EpisodeList(BaseModel):
    data: List[Episode]
    total: int


class EpisodeSourcesResponse(BaseModel):
    episode_id: int
    sources: List[VideoSource]


class WatchProgressUpdate(BaseModel):
    progress: int = Field(..., ge=0)  # в секундах
    completed: bool = False
