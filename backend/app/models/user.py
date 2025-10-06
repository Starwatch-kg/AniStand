from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    favorites = relationship("UserFavorite", back_populates="user", cascade="all, delete-orphan")
    watch_history = relationship("WatchHistory", back_populates="user", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"


class UserFavorite(Base):
    __tablename__ = "user_favorites"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    anime_id = Column(Integer, ForeignKey("anime.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="favorites")
    anime = relationship("Anime", back_populates="favorites")

    def __repr__(self):
        return f"<UserFavorite(user_id={self.user_id}, anime_id={self.anime_id})>"


class WatchHistory(Base):
    __tablename__ = "watch_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    episode_id = Column(Integer, ForeignKey("episodes.id", ondelete="CASCADE"), nullable=False)
    progress = Column(Integer, default=0)  # прогресс в секундах
    completed = Column(Boolean, default=False)
    watched_at = Column(DateTime(timezone=True), server_default=func.now())

    # Уникальность по пользователю и эпизоду
    __table_args__ = (UniqueConstraint('user_id', 'episode_id', name='unique_user_episode'),)

    # Relationships
    user = relationship("User", back_populates="watch_history")
    episode = relationship("Episode", back_populates="watch_history")

    def __repr__(self):
        return f"<WatchHistory(id={self.id}, user_id={self.user_id}, episode_id={self.episode_id})>"


class Rating(Base):
    __tablename__ = "ratings"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    anime_id = Column(Integer, ForeignKey("anime.id", ondelete="CASCADE"), primary_key=True)
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Ограничение на оценку от 1 до 10
    __table_args__ = (CheckConstraint('score >= 1 AND score <= 10', name='valid_score'),)

    # Relationships
    user = relationship("User", back_populates="ratings")
    anime = relationship("Anime", back_populates="ratings")

    def __repr__(self):
        return f"<Rating(user_id={self.user_id}, anime_id={self.anime_id}, score={self.score})>"
