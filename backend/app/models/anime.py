from sqlalchemy import Column, Integer, String, Text, Boolean, Date, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# Таблица связи многие-ко-многим для аниме и жанров
anime_genres = Table(
    'anime_genres',
    Base.metadata,
    Column('anime_id', Integer, ForeignKey('anime.id', ondelete='CASCADE'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genres.id', ondelete='CASCADE'), primary_key=True)
)

# Таблица связи многие-ко-многим для аниме и студий
anime_studios = Table(
    'anime_studios',
    Base.metadata,
    Column('anime_id', Integer, ForeignKey('anime.id', ondelete='CASCADE'), primary_key=True),
    Column('studio_id', Integer, ForeignKey('studios.id', ondelete='CASCADE'), primary_key=True)
)


class Anime(Base):
    __tablename__ = "anime"

    id = Column(Integer, primary_key=True, index=True)
    anilist_id = Column(Integer, unique=True, index=True)
    title_romaji = Column(String(255), nullable=False, index=True)
    title_english = Column(String(255), index=True)
    title_native = Column(String(255))
    description = Column(Text)
    cover_image = Column(String(500))
    banner_image = Column(String(500))
    episodes = Column(Integer)
    duration = Column(Integer)  # в минутах
    status = Column(String(50), index=True)  # FINISHED, RELEASING, NOT_YET_RELEASED
    start_date = Column(Date)
    end_date = Column(Date)
    season = Column(String(20))  # WINTER, SPRING, SUMMER, FALL
    season_year = Column(Integer, index=True)
    average_score = Column(Integer)
    popularity = Column(Integer)
    is_adult = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    genres = relationship("Genre", secondary=anime_genres, back_populates="anime_list")
    studios = relationship("Studio", secondary=anime_studios, back_populates="anime_list")
    episodes_list = relationship("Episode", back_populates="anime", cascade="all, delete-orphan")
    favorites = relationship("UserFavorite", back_populates="anime", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="anime", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="anime", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Anime(id={self.id}, title='{self.title_romaji}')>"


class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)

    # Relationships
    anime_list = relationship("Anime", secondary=anime_genres, back_populates="genres")

    def __repr__(self):
        return f"<Genre(id={self.id}, name='{self.name}')>"


class Studio(Base):
    __tablename__ = "studios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)

    # Relationships
    anime_list = relationship("Anime", secondary=anime_studios, back_populates="studios")

    def __repr__(self):
        return f"<Studio(id={self.id}, name='{self.name}')>"


# Для обратной совместимости (если нужно)
class AnimeGenre:
    pass


class AnimeStudio:
    pass
