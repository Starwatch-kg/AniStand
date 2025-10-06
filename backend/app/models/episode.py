from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Episode(Base):
    __tablename__ = "episodes"

    id = Column(Integer, primary_key=True, index=True)
    anime_id = Column(Integer, ForeignKey("anime.id", ondelete="CASCADE"), nullable=False)
    episode_number = Column(Integer, nullable=False)
    title = Column(String(255))
    description = Column(Text)
    air_date = Column(Date)
    duration = Column(Integer)  # в секундах
    thumbnail = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Уникальность по аниме и номеру эпизода
    __table_args__ = (UniqueConstraint('anime_id', 'episode_number', name='unique_anime_episode'),)

    # Relationships
    anime = relationship("Anime", back_populates="episodes_list")
    video_sources = relationship("VideoSource", back_populates="episode", cascade="all, delete-orphan")
    watch_history = relationship("WatchHistory", back_populates="episode", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="episode", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Episode(id={self.id}, anime_id={self.anime_id}, episode_number={self.episode_number})>"


class VideoSource(Base):
    __tablename__ = "video_sources"

    id = Column(Integer, primary_key=True, index=True)
    episode_id = Column(Integer, ForeignKey("episodes.id", ondelete="CASCADE"), nullable=False)
    source_name = Column(String(100), nullable=False, index=True)  # animepahe, gogoanime, etc.
    video_url = Column(String(1000), nullable=False)
    quality = Column(String(20))  # 720p, 1080p, etc.
    subtitle_url = Column(String(1000))
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    episode = relationship("Episode", back_populates="video_sources")

    def __repr__(self):
        return f"<VideoSource(id={self.id}, episode_id={self.episode_id}, source='{self.source_name}')>"
