# 🎌 AniStand Backend

Современный backend для платформы просмотра аниме, построенный на FastAPI с поддержкой парсинга и кеширования.

## 🚀 Особенности

- **FastAPI** - современный, быстрый веб-фреймворк
- **PostgreSQL** - надежная реляционная база данных
- **Redis** - кеширование для высокой производительности
- **JWT Authentication** - безопасная аутентификация
- **Celery** - асинхронные задачи парсинга
- **Парсинг** - интеграция с AniList, Animepahe, GogoAnime
- **Docker** - контейнеризация для легкого развертывания

## 📋 Требования

- Python 3.11+
- PostgreSQL 13+
- Redis 6+
- Docker (опционально)

## 🛠️ Установка

### Локальная установка

1. **Клонирование репозитория:**
```bash
git clone https://github.com/Starwatch-kg/AniStand.git
cd AniStand/backend
```

2. **Создание виртуального окружения:**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

3. **Установка зависимостей:**
```bash
pip install -r requirements.txt
```

4. **Настройка переменных окружения:**
```bash
cp .env.example .env
# Отредактируйте .env файл с вашими настройками
```

5. **Настройка базы данных:**
```bash
# Создайте базу данных PostgreSQL
createdb anistand

# Выполните миграции
alembic upgrade head
```

6. **Запуск сервера:**
```bash
uvicorn app.main:app --reload
```

### Docker установка

1. **Запуск с Docker Compose:**
```bash
docker-compose up -d
```

Это запустит все необходимые сервисы:
- PostgreSQL (порт 5432)
- Redis (порт 6379)
- FastAPI Backend (порт 8000)
- Celery Worker
- Celery Beat
- Flower (порт 5555)

## 🔧 Конфигурация

### Переменные окружения

```env
# Основные настройки
APP_NAME=AniStand API
VERSION=1.0.0
DEBUG=True

# База данных
DATABASE_URL=postgresql+asyncpg://user:password@localhost/anistand

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=["http://localhost:3000"]

# Парсинг
PARSER_DELAY=1.0
CACHE_TTL_ANIME=3600
```

## 📚 API Документация

После запуска сервера документация доступна по адресам:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Основные эндпоинты

#### Аутентификация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `POST /api/v1/auth/refresh` - Обновление токена

#### Аниме
- `GET /api/v1/anime/` - Список аниме с фильтрами
- `GET /api/v1/anime/{id}` - Детали аниме
- `GET /api/v1/anime/search` - Поиск аниме

#### Эпизоды
- `GET /api/v1/episodes/anime/{anime_id}` - Эпизоды аниме
- `GET /api/v1/episodes/{id}/sources` - Источники видео
- `POST /api/v1/episodes/{id}/progress` - Сохранение прогресса

#### Пользователи
- `GET /api/v1/users/me` - Профиль пользователя
- `POST /api/v1/users/favorites` - Добавить в избранное
- `GET /api/v1/users/history` - История просмотров

## 🗄️ Структура базы данных

### Основные таблицы

- **anime** - Информация об аниме
- **episodes** - Эпизоды
- **video_sources** - Источники видео
- **users** - Пользователи
- **user_favorites** - Избранное
- **watch_history** - История просмотров
- **comments** - Комментарии
- **ratings** - Рейтинги

## 🤖 Система парсинга

### Поддерживаемые источники

1. **AniList** - Метаданные аниме
2. **Animepahe** - Видео источники
3. **GogoAnime** - Видео источники

### Планировщик задач

- **Обновление метаданных** - каждые 6 часов
- **Обновление видео** - каждые 2 часа
- **Проверка новых эпизодов** - каждый час
- **Очистка неактивных ссылок** - ежедневно

### Запуск парсера

```bash
# Celery Worker
celery -A app.parsers.scheduler worker --loglevel=info

# Celery Beat (планировщик)
celery -A app.parsers.scheduler beat --loglevel=info

# Flower (мониторинг)
celery -A app.parsers.scheduler flower
```

## 🧪 Тестирование

```bash
# Установка тестовых зависимостей
pip install pytest pytest-asyncio httpx

# Запуск тестов
pytest

# С покрытием
pytest --cov=app
```

## 📊 Мониторинг

### Health Check
```bash
curl http://localhost:8000/health
```

### Статистика Redis
```bash
curl http://localhost:8000/api/v1/cache/stats
```

### Flower (Celery)
Откройте http://localhost:5555 для мониторинга задач Celery

## 🔒 Безопасность

- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- CORS настройки
- Rate limiting (планируется)
- Валидация входных данных

## 🚀 Развертывание

### Production настройки

1. **Переменные окружения:**
```env
DEBUG=False
JWT_SECRET_KEY=strong-random-key
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

2. **Gunicorn:**
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

3. **Nginx** (рекомендуется):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🤝 Разработка

### Структура проекта

```
backend/
├── app/
│   ├── api/           # API роуты
│   ├── models/        # SQLAlchemy модели
│   ├── schemas/       # Pydantic схемы
│   ├── services/      # Бизнес-логика
│   ├── parsers/       # Парсеры данных
│   ├── utils/         # Утилиты
│   ├── config.py      # Конфигурация
│   ├── database.py    # Настройки БД
│   └── main.py        # Точка входа
├── alembic/           # Миграции БД
├── requirements.txt   # Зависимости
└── docker-compose.yml # Docker настройки
```

### Добавление нового парсера

1. Создайте класс, наследующий от `BaseParser`
2. Реализуйте методы `get_anime_metadata`, `get_episodes`, `get_video_sources`
3. Добавьте в планировщик задач

### Добавление нового API эндпоинта

1. Создайте Pydantic схемы в `schemas/`
2. Добавьте бизнес-логику в `services/`
3. Создайте роуты в `api/routes/`
4. Подключите роутер в `main.py`

## 📝 Лицензия

MIT License

## 🆘 Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте [Issues](https://github.com/Starwatch-kg/AniStand/issues)
2. Создайте новый Issue
3. Свяжитесь с командой разработки

---

**AniStand Backend** - Современное решение для платформы аниме 🎌
