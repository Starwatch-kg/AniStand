import json
import pickle
from typing import Any, Optional, Union
import aioredis
from loguru import logger

from app.config import settings


class CacheService:
    """Сервис для работы с Redis кешем"""
    
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None
        self._connected = False
    
    async def connect(self):
        """Подключение к Redis"""
        try:
            self.redis = aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
            # Проверяем подключение
            await self.redis.ping()
            self._connected = True
            logger.info("Successfully connected to Redis")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {str(e)}")
            self._connected = False
    
    async def disconnect(self):
        """Отключение от Redis"""
        if self.redis:
            await self.redis.close()
            self._connected = False
            logger.info("Disconnected from Redis")
    
    async def get(self, key: str, default: Any = None) -> Any:
        """Получить значение из кеша"""
        if not self._connected:
            return default
        
        try:
            value = await self.redis.get(key)
            if value is None:
                return default
            
            # Пытаемся десериализовать как JSON
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                # Если не JSON, возвращаем как строку
                return value
                
        except Exception as e:
            logger.error(f"Error getting cache key {key}: {str(e)}")
            return default
    
    async def set(
        self, 
        key: str, 
        value: Any, 
        ttl: Optional[int] = None
    ) -> bool:
        """Установить значение в кеш"""
        if not self._connected:
            return False
        
        try:
            # Сериализуем в JSON если возможно
            if isinstance(value, (dict, list, tuple)):
                serialized_value = json.dumps(value, ensure_ascii=False)
            elif isinstance(value, (str, int, float, bool)):
                serialized_value = json.dumps(value)
            else:
                # Для сложных объектов используем строковое представление
                serialized_value = str(value)
            
            if ttl:
                await self.redis.setex(key, ttl, serialized_value)
            else:
                await self.redis.set(key, serialized_value)
            
            return True
            
        except Exception as e:
            logger.error(f"Error setting cache key {key}: {str(e)}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Удалить ключ из кеша"""
        if not self._connected:
            return False
        
        try:
            result = await self.redis.delete(key)
            return result > 0
        except Exception as e:
            logger.error(f"Error deleting cache key {key}: {str(e)}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Проверить существование ключа"""
        if not self._connected:
            return False
        
        try:
            result = await self.redis.exists(key)
            return result > 0
        except Exception as e:
            logger.error(f"Error checking cache key {key}: {str(e)}")
            return False
    
    async def expire(self, key: str, ttl: int) -> bool:
        """Установить TTL для ключа"""
        if not self._connected:
            return False
        
        try:
            result = await self.redis.expire(key, ttl)
            return result
        except Exception as e:
            logger.error(f"Error setting TTL for cache key {key}: {str(e)}")
            return False
    
    async def clear_pattern(self, pattern: str) -> int:
        """Удалить все ключи по паттерну"""
        if not self._connected:
            return 0
        
        try:
            keys = await self.redis.keys(pattern)
            if keys:
                result = await self.redis.delete(*keys)
                return result
            return 0
        except Exception as e:
            logger.error(f"Error clearing cache pattern {pattern}: {str(e)}")
            return 0
    
    async def get_stats(self) -> dict:
        """Получить статистику Redis"""
        if not self._connected:
            return {"connected": False}
        
        try:
            info = await self.redis.info()
            return {
                "connected": True,
                "used_memory": info.get("used_memory_human"),
                "connected_clients": info.get("connected_clients"),
                "total_commands_processed": info.get("total_commands_processed"),
                "keyspace_hits": info.get("keyspace_hits"),
                "keyspace_misses": info.get("keyspace_misses"),
                "hit_rate": round(
                    info.get("keyspace_hits", 0) / 
                    max(info.get("keyspace_hits", 0) + info.get("keyspace_misses", 0), 1) * 100, 
                    2
                )
            }
        except Exception as e:
            logger.error(f"Error getting Redis stats: {str(e)}")
            return {"connected": False, "error": str(e)}


# Глобальный экземпляр сервиса кеша
cache_service = CacheService()


# Декоратор для кеширования функций
def cache_result(key_prefix: str, ttl: int = 3600):
    """Декоратор для кеширования результатов функций"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Создаем ключ кеша на основе аргументов
            cache_key = f"{key_prefix}:{hash(str(args) + str(sorted(kwargs.items())))}"
            
            # Пытаемся получить из кеша
            cached_result = await cache_service.get(cache_key)
            if cached_result is not None:
                logger.debug(f"Cache hit for key: {cache_key}")
                return cached_result
            
            # Выполняем функцию
            result = await func(*args, **kwargs)
            
            # Сохраняем в кеш
            await cache_service.set(cache_key, result, ttl)
            logger.debug(f"Cache set for key: {cache_key}")
            
            return result
        return wrapper
    return decorator


# Специализированные функции кеширования для разных типов данных

async def cache_anime_list(filters: dict, data: list, ttl: int = None) -> bool:
    """Кешировать список аниме"""
    key = f"anime_list:{hash(str(sorted(filters.items())))}"
    return await cache_service.set(
        key, 
        data, 
        ttl or settings.CACHE_TTL_ANIME
    )


async def get_cached_anime_list(filters: dict) -> Optional[list]:
    """Получить кешированный список аниме"""
    key = f"anime_list:{hash(str(sorted(filters.items())))}"
    return await cache_service.get(key)


async def cache_anime_detail(anime_id: int, data: dict, ttl: int = None) -> bool:
    """Кешировать детали аниме"""
    key = f"anime_detail:{anime_id}"
    return await cache_service.set(
        key, 
        data, 
        ttl or settings.CACHE_TTL_ANIME
    )


async def get_cached_anime_detail(anime_id: int) -> Optional[dict]:
    """Получить кешированные детали аниме"""
    key = f"anime_detail:{anime_id}"
    return await cache_service.get(key)


async def cache_episode_sources(episode_id: int, sources: list, ttl: int = None) -> bool:
    """Кешировать источники эпизода"""
    key = f"episode_sources:{episode_id}"
    return await cache_service.set(
        key, 
        sources, 
        ttl or settings.CACHE_TTL_VIDEO_SOURCES
    )


async def get_cached_episode_sources(episode_id: int) -> Optional[list]:
    """Получить кешированные источники эпизода"""
    key = f"episode_sources:{episode_id}"
    return await cache_service.get(key)


async def invalidate_anime_cache(anime_id: int) -> int:
    """Инвалидировать кеш для аниме"""
    pattern = f"anime_*:{anime_id}*"
    return await cache_service.clear_pattern(pattern)


async def invalidate_episode_cache(episode_id: int) -> int:
    """Инвалидировать кеш для эпизода"""
    pattern = f"episode_*:{episode_id}*"
    return await cache_service.clear_pattern(pattern)
