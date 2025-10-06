from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from sqlalchemy.orm import selectinload
from typing import List, Optional
import math

from app.models.anime import Anime, Genre, Studio
from app.schemas.anime import AnimeCreate, AnimeUpdate, AnimeFilters, AnimeSearch, AnimeList


class AnimeService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_anime_list(self, filters: AnimeFilters) -> AnimeList:
        """Получить список аниме с фильтрами и пагинацией"""
        
        query = select(Anime).options(
            selectinload(Anime.genres),
            selectinload(Anime.studios)
        )
        
        # Применяем фильтры
        conditions = []
        
        if filters.genre:
            query = query.join(Anime.genres).where(Genre.name.ilike(f"%{filters.genre}%"))
        
        if filters.year:
            conditions.append(Anime.season_year == filters.year)
        
        if filters.status:
            conditions.append(Anime.status == filters.status)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # Сортировка
        if filters.sort == "popularity":
            query = query.order_by(Anime.popularity.desc())
        elif filters.sort == "score":
            query = query.order_by(Anime.average_score.desc())
        elif filters.sort == "year":
            query = query.order_by(Anime.season_year.desc())
        elif filters.sort == "title":
            query = query.order_by(Anime.title_romaji)
        
        # Подсчет общего количества
        count_query = select(func.count(Anime.id))
        if conditions:
            count_query = count_query.where(and_(*conditions))
        
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Пагинация
        offset = (filters.page - 1) * filters.limit
        query = query.offset(offset).limit(filters.limit)
        
        result = await self.db.execute(query)
        anime_list = result.scalars().all()
        
        pages = math.ceil(total / filters.limit)
        
        return AnimeList(
            data=anime_list,
            total=total,
            page=filters.page,
            limit=filters.limit,
            pages=pages
        )

    async def search_anime(self, search_params: AnimeSearch) -> List[Anime]:
        """Поиск аниме по названию"""
        
        query = select(Anime).options(
            selectinload(Anime.genres),
            selectinload(Anime.studios)
        ).where(
            or_(
                Anime.title_romaji.ilike(f"%{search_params.query}%"),
                Anime.title_english.ilike(f"%{search_params.query}%"),
                Anime.title_native.ilike(f"%{search_params.query}%")
            )
        ).limit(search_params.limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_anime_by_id(self, anime_id: int) -> Optional[Anime]:
        """Получить аниме по ID"""
        
        query = select(Anime).options(
            selectinload(Anime.genres),
            selectinload(Anime.studios),
            selectinload(Anime.episodes_list)
        ).where(Anime.id == anime_id)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def create_anime(self, anime_data: AnimeCreate) -> Anime:
        """Создать новое аниме"""
        
        # Создаем объект аниме
        anime = Anime(**anime_data.model_dump(exclude={"genre_ids", "studio_ids"}))
        
        # Добавляем жанры
        if anime_data.genre_ids:
            genres_result = await self.db.execute(
                select(Genre).where(Genre.id.in_(anime_data.genre_ids))
            )
            genres = genres_result.scalars().all()
            anime.genres = genres
        
        # Добавляем студии
        if anime_data.studio_ids:
            studios_result = await self.db.execute(
                select(Studio).where(Studio.id.in_(anime_data.studio_ids))
            )
            studios = studios_result.scalars().all()
            anime.studios = studios
        
        self.db.add(anime)
        await self.db.commit()
        await self.db.refresh(anime)
        
        return anime

    async def update_anime(self, anime_id: int, anime_data: AnimeUpdate) -> Optional[Anime]:
        """Обновить аниме"""
        
        result = await self.db.execute(
            select(Anime).where(Anime.id == anime_id)
        )
        anime = result.scalar_one_or_none()
        
        if not anime:
            return None
        
        # Обновляем поля
        update_data = anime_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(anime, field, value)
        
        await self.db.commit()
        await self.db.refresh(anime)
        
        return anime

    async def delete_anime(self, anime_id: int) -> bool:
        """Удалить аниме"""
        
        result = await self.db.execute(
            select(Anime).where(Anime.id == anime_id)
        )
        anime = result.scalar_one_or_none()
        
        if not anime:
            return False
        
        await self.db.delete(anime)
        await self.db.commit()
        
        return True
