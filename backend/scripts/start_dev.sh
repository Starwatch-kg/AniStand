#!/bin/bash

# Скрипт для запуска разработческого окружения AniStand

echo "🎌 Starting AniStand Development Environment..."

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp .env.example .env
    echo "✅ Please edit .env file with your settings"
fi

# Проверяем наличие виртуального окружения
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Активируем виртуальное окружение
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Устанавливаем зависимости
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Проверяем подключение к базе данных
echo "🗄️  Checking database connection..."
python -c "
import asyncio
from app.database import engine
async def check_db():
    try:
        async with engine.begin() as conn:
            print('✅ Database connection successful')
    except Exception as e:
        print(f'❌ Database connection failed: {e}')
        print('💡 Make sure PostgreSQL is running and DATABASE_URL is correct')
        exit(1)
asyncio.run(check_db())
"

# Проверяем подключение к Redis
echo "🔴 Checking Redis connection..."
python -c "
import asyncio
from app.services.cache_service import cache_service
async def check_redis():
    try:
        await cache_service.connect()
        print('✅ Redis connection successful')
        await cache_service.disconnect()
    except Exception as e:
        print(f'⚠️  Redis connection failed: {e}')
        print('💡 Redis is optional but recommended for caching')
asyncio.run(check_redis())
"

# Выполняем миграции
echo "🔄 Running database migrations..."
alembic upgrade head

# Предлагаем заполнить тестовыми данными
read -p "🌱 Do you want to seed the database with sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    python scripts/init_db.py
fi

# Запускаем сервер
echo "🚀 Starting FastAPI development server..."
echo "📖 API Documentation will be available at:"
echo "   - Swagger UI: http://localhost:8000/docs"
echo "   - ReDoc: http://localhost:8000/redoc"
echo "   - Health Check: http://localhost:8000/health"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
