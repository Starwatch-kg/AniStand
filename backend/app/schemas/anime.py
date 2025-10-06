from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


class GenreBase(BaseModel):
    name: str = Field(..., max_length=100)


class GenreCreate(GenreBase):
    pass


class Genre(GenreBase):
    id: int

    class Config:
        from_attributes = True


class StudioBase(BaseModel):
    name: str = Field(..., max_length=255)


class StudioCreate(StudioBase):
    pass


class Studio(StudioBase):
    id: int

    class Config:
        from_attributes = True


class AnimeBase(BaseModel):
    title_romaji: str = Field(..., max_length=255)
    title_english: Optional[str] = Field(None, max_length=255)
    title_native: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    cover_image: Optional[str] = Field(None, max_length=500)
    banner_image: Optional[str] = Field(None, max_length=500)
    episodes: Optional[int] = None
    duration: Optional[int] = None
    status: Optional[str] = Field(None, max_length=50)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    season: Optional[str] = Field(None, max_length=20)
    season_year: Optional[int] = None
    average_score: Optional[int] = None
    popularity: Optional[int] = None
    is_adult: bool = False


class AnimeCreate(AnimeBase):
    anilist_id: Optional[int] = None
    genre_ids: Optional[List[int]] = []
    studio_ids: Optional[List[int]] = []


class AnimeUpdate(BaseModel):
    title_romaji: Optional[str] = Field(None, max_length=255)
    title_english: Optional[str] = Field(None, max_length=255)
    title_native: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    cover_image: Optional[str] = Field(None, max_length=500)
    banner_image: Optional[str] = Field(None, max_length=500)
    episodes: Optional[int] = None
    duration: Optional[int] = None
    status: Optional[str] = Field(None, max_length=50)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    season: Optional[str] = Field(None, max_length=20)
    season_year: Optional[int] = None
    average_score: Optional[int] = None
    popularity: Optional[int] = None
    is_adult: Optional[bool] = None


class AnimeInDB(AnimeBase):
    id: int
    anilist_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Anime(AnimeInDB):
    genres: List[Genre] = []
    studios: List[Studio] = []


class AnimeList(BaseModel):
    data: List[Anime]
    total: int
    page: int
    limit: int
    pages: int


class AnimeSearch(BaseModel):
    query: str = Field(..., min_length=1, max_length=255)
    limit: int = Field(10, ge=1, le=50)


class AnimeFilters(BaseModel):
    genre: Optional[str] = None
    year: Optional[int] = None
    status: Optional[str] = None
    sort: str = Field("popularity", regex="^(popularity|score|year|title)$")
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)
