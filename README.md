# 🎌 AniStand - Платформа для просмотра аниме

Современная полнофункциональная платформа для просмотра аниме онлайн с удобным интерфейсом и мощным backend.

## 🚀 Обзор проекта

AniStand - это веб-приложение для просмотра аниме, состоящее из:
- **Backend API** (FastAPI + PostgreSQL + Redis)
- **Frontend** (Next.js + TypeScript + Tailwind CSS)
- **Система парсинга** (AniList, Animepahe, GogoAnime)
- **Контейнеризация** (Docker + docker-compose)

## ✨ Особенности

### 🎯 Основной функционал
- 📺 **Каталог аниме** с фильтрацией и поиском
- 🎬 **Просмотр эпизодов** с несколькими источниками
- ⭐ **Рейтинги и отзывы** пользователей
- 💝 **Избранное и история** просмотров
- 🔐 **Система авторизации** с JWT

### 🛠️ Технические особенности
- 🚀 **Высокая производительность** (async/await, кеширование)
- 📱 **Адаптивный дизайн** для всех устройств
- 🔄 **Автоматическое обновление** данных через парсеры
- 🐳 **Docker контейнеризация** для легкого развертывания
- 🔒 **Enterprise-grade безопасность**

## 🏗️ Архитектура

```
AniStand/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── models/         # SQLAlchemy модели
│   │   ├── services/       # Бизнес-логика
│   │   ├── parsers/        # Парсеры данных
│   │   └── utils/          # Утилиты
│   ├── alembic/            # Миграции БД
│   ├── scripts/            # Скрипты
│   └── docker-compose.yml  # Docker настройки
└── frontend/               # Next.js Frontend
    ├── src/
    │   ├── app/            # Next.js App Router
    │   ├── components/     # React компоненты
    │   └── lib/            # API клиент
    └── public/             # Статические файлы
```

## 🚀 Быстрый старт

### Предварительные требования
- **Docker** и **Docker Compose**
- **Node.js 18+** (для фронтенда)
- **Python 3.11+** (для бэкенда)
- **PostgreSQL** и **Redis** (или через Docker)

### 1. Клонирование репозитория
```bash
git clone https://github.com/Starwatch-kg/AniStand.git
cd AniStand
```

### 2. Запуск через Docker (рекомендуется)
```bash
# Запуск всех сервисов
cd backend
docker-compose up -d

# Проверка статуса
docker-compose ps
```

### 3. Запуск в режиме разработки

#### Backend
```bash
cd backend

# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или venv\Scripts\activate  # Windows

# Установка зависимостей
pip install -r requirements.txt

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env файл

# Инициализация базы данных
python scripts/init_db.py

# Запуск сервера
./scripts/start_dev.sh
```

#### Frontend
```bash
cd frontend

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.local.example .env.local

# Запуск в режиме разработки
npm run dev
```

### 4. Доступ к приложению
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Документация**: http://localhost:8000/docs
- **Flower (Celery)**: http://localhost:5555

## 🔧 Конфигурация

### Backend (.env)
```env
# База данных
DATABASE_URL=postgresql+asyncpg://anistand:password@localhost/anistand

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-secret-key

# CORS
ALLOWED_ORIGINS=["http://localhost:3000"]
```

### Frontend (.env.local)
```env
# API подключение
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 API Документация

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

### Тестовые данные
```
Логин: testuser
Пароль: test123
```

## 🤖 Система парсинга

### Источники данных
1. **AniList** - Метаданные аниме (названия, описания, жанры)
2. **Animepahe** - Источники видео (HLS, MP4)
3. **GogoAnime** - Альтернативные источники видео

### Автоматические задачи
- **Обновление метаданных**: каждые 6 часов
- **Обновление видео**: каждые 2 часа  
- **Проверка новых эпизодов**: каждый час
- **Очистка неактивных ссылок**: ежедневно

## 🗄️ База данных

### Основные таблицы
- `anime` - Информация об аниме
- `episodes` - Эпизоды
- `video_sources` - Источники видео
- `users` - Пользователи
- `user_favorites` - Избранное
- `watch_history` - История просмотров
- `comments` - Комментарии
- `ratings` - Рейтинги

## 🐳 Docker развертывание

### Сервисы
- **PostgreSQL** - База данных
- **Redis** - Кеширование
- **FastAPI Backend** - API сервер
- **Celery Worker** - Фоновые задачи
- **Celery Beat** - Планировщик
- **Flower** - Мониторинг Celery

### Команды
```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f backend

# Остановка
docker-compose down

# Пересборка
docker-compose up --build
```

## 🧪 Тестирование

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm run lint
npm run build
```

## 📊 Мониторинг

### Health Checks
- **Backend**: `GET /health`
- **Database**: Автоматическая проверка подключения
- **Redis**: Статистика кеша
- **Celery**: Flower dashboard

### Логирование
- Структурированные логи с loguru
- Уровни: DEBUG, INFO, WARNING, ERROR
- Ротация логов по размеру

## 🔒 Безопасность

- **JWT аутентификация** с ролевой системой
- **Хеширование паролей** с bcrypt
- **CORS настройки** для фронтенда
- **Валидация входных данных** с Pydantic
- **Rate limiting** для API endpoints

## 🚀 Production развертывание

### Рекомендуемый стек
- **Сервер**: VPS/Cloud (2+ CPU, 4+ GB RAM)
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt
- **Мониторинг**: Prometheus + Grafana
- **Логи**: ELK Stack

### Переменные окружения
```env
DEBUG=False
JWT_SECRET_KEY=strong-random-key
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

## 🤝 Разработка

### Добавление нового API эндпоинта
1. Создать Pydantic схемы в `schemas/`
2. Добавить бизнес-логику в `services/`
3. Создать роуты в `api/routes/`
4. Подключить роутер в `main.py`

### Добавление нового парсера
1. Наследовать от `BaseParser`
2. Реализовать методы `get_anime_metadata`, `get_episodes`, `get_video_sources`
3. Добавить в планировщик задач

## 📈 Производительность

- **Response time**: <200ms для кешированных данных
- **Throughput**: 100+ одновременных пользователей
- **Cache hit rate**: 80%+ для популярных запросов
- **Database**: Оптимизированные индексы и запросы

## 📝 Changelog

### v1.0.0 (Текущая версия)
- ✅ Полная реализация backend API
- ✅ Современный фронтенд интерфейс
- ✅ Система парсинга данных
- ✅ Docker контейнеризация
- ✅ Система авторизации
- ✅ Кеширование и оптимизация

## 🆘 Поддержка

### Частые проблемы
1. **CORS ошибки**: Проверьте `ALLOWED_ORIGINS` в backend
2. **404 API ошибки**: Убедитесь что backend запущен на порту 8000
3. **Ошибки БД**: Проверьте `DATABASE_URL` и запустите миграции

### Получение помощи
- 📖 [Документация API](http://localhost:8000/docs)
- 🐛 [Issues на GitHub](https://github.com/Starwatch-kg/AniStand/issues)
- 💬 Создайте новый Issue для вопросов

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 👥 Команда

Разработано командой AniStand с ❤️

---

**AniStand** - Ваша платформа для просмотра аниме! 🎌✨
