from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.models.user import User, UserFavorite, WatchHistory, Rating
from app.models.anime import Anime
from app.schemas.user import UserCreate, UserUpdate
from app.utils.security import get_password_hash, verify_password


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Получить пользователя по username"""
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Получить пользователя по email"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def create_user(self, user_data: UserCreate) -> User:
        """Создать нового пользователя"""
        hashed_password = get_password_hash(user_data.password)
        
        user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=hashed_password
        )
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        return user

    async def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """Аутентификация пользователя"""
        user = await self.get_user_by_username(username)
        
        if not user:
            return None
        
        if not verify_password(password, user.password_hash):
            return None
        
        return user

    async def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Обновить пользователя"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        update_data = user_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user

    async def add_to_favorites(self, user_id: int, anime_id: int) -> bool:
        """Добавить аниме в избранное"""
        # Проверяем, не добавлено ли уже
        existing = await self.db.execute(
            select(UserFavorite).where(
                UserFavorite.user_id == user_id,
                UserFavorite.anime_id == anime_id
            )
        )
        
        if existing.scalar_one_or_none():
            return False
        
        favorite = UserFavorite(user_id=user_id, anime_id=anime_id)
        self.db.add(favorite)
        await self.db.commit()
        
        return True

    async def remove_from_favorites(self, user_id: int, anime_id: int) -> bool:
        """Удалить аниме из избранного"""
        result = await self.db.execute(
            delete(UserFavorite).where(
                UserFavorite.user_id == user_id,
                UserFavorite.anime_id == anime_id
            )
        )
        
        return result.rowcount > 0

    async def get_user_favorites(self, user_id: int) -> List[Anime]:
        """Получить избранное аниме пользователя"""
        result = await self.db.execute(
            select(Anime).join(UserFavorite).where(
                UserFavorite.user_id == user_id
            ).options(
                selectinload(Anime.genres),
                selectinload(Anime.studios)
            )
        )
        
        return result.scalars().all()

    async def get_watch_history(self, user_id: int) -> List[WatchHistory]:
        """Получить историю просмотров пользователя"""
        result = await self.db.execute(
            select(WatchHistory).where(
                WatchHistory.user_id == user_id
            ).order_by(WatchHistory.watched_at.desc())
        )
        
        return result.scalars().all()

    async def rate_anime(self, user_id: int, anime_id: int, score: int) -> Rating:
        """Оценить аниме"""
        # Проверяем существующую оценку
        existing = await self.db.execute(
            select(Rating).where(
                Rating.user_id == user_id,
                Rating.anime_id == anime_id
            )
        )
        
        rating = existing.scalar_one_or_none()
        
        if rating:
            # Обновляем существующую оценку
            rating.score = score
        else:
            # Создаем новую оценку
            rating = Rating(user_id=user_id, anime_id=anime_id, score=score)
            self.db.add(rating)
        
        await self.db.commit()
        await self.db.refresh(rating)
        
        return rating

    async def get_user_ratings(self, user_id: int) -> List[Rating]:
        """Получить рейтинги пользователя"""
        result = await self.db.execute(
            select(Rating).where(Rating.user_id == user_id)
        )
        
        return result.scalars().all()
