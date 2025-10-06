#!/usr/bin/env python3
"""
Скрипт инициализации базы данных
Создает таблицы и заполняет тестовыми данными
"""
import asyncio
import sys
import os

# Добавляем путь к приложению
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import create_tables, drop_tables
from app.utils.seed_data import seed_database
from app.services.cache_service import cache_service
from loguru import logger


async def init_database(drop_existing: bool = False):
    """Инициализация базы данных"""
    
    try:
        if drop_existing:
            logger.info("Dropping existing tables...")
            await drop_tables()
        
        logger.info("Creating database tables...")
        await create_tables()
        
        logger.info("Seeding database with sample data...")
        await seed_database()
        
        logger.info("Connecting to Redis cache...")
        await cache_service.connect()
        
        logger.info("Database initialization completed successfully!")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise
    finally:
        if cache_service._connected:
            await cache_service.disconnect()


async def reset_database():
    """Полный сброс базы данных"""
    logger.warning("Resetting database - all data will be lost!")
    await init_database(drop_existing=True)


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Initialize AniStand database")
    parser.add_argument(
        "--reset", 
        action="store_true", 
        help="Drop existing tables before creating new ones"
    )
    
    args = parser.parse_args()
    
    if args.reset:
        asyncio.run(reset_database())
    else:
        asyncio.run(init_database())
