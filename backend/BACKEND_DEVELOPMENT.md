# 🔧 Backend Development Branch

Эта ветка предназначена для разработки backend логики AniStand.

## 🎯 Цели разработки

### 📡 **Парсеры данных**
- **AniList API** - метаданные аниме (названия, описания, жанры, рейтинги)
- **Animepahe Parser** - источники видео (HLS, MP4 ссылки)
- **GogoAnime Parser** - альтернативные источники видео
- **MyAnimeList Integration** - дополнительные данные и рейтинги

### 🔌 **API Endpoints**
- **Anime Management** - CRUD операции для аниме
- **Episode Management** - управление эпизодами и источниками
- **User System** - регистрация, авторизация, профили
- **Search & Filters** - поиск по названию, жанрам, годам
- **Favorites & History** - избранное и история просмотров

### 🗄️ **База данных**
- **PostgreSQL** - основная база данных
- **Redis** - кеширование и сессии
- **Alembic** - миграции схемы БД
- **SQLAlchemy** - ORM для работы с данными

## 📁 Структура разработки

```
backend/
├── app/
│   ├── api/              # API роуты
│   │   ├── v1/          # Версия API v1
│   │   │   ├── anime.py     # Аниме эндпоинты
│   │   │   ├── episodes.py  # Эпизоды эндпоинты
│   │   │   ├── auth.py      # Авторизация
│   │   │   └── users.py     # Пользователи
│   ├── parsers/         # Парсеры данных
│   │   ├── anilist.py       # AniList API
│   │   ├── animepahe.py     # Animepahe парсер
│   │   ├── gogoanime.py     # GogoAnime парсер
│   │   └── base.py          # Базовый класс парсера
│   ├── services/        # Бизнес-логика
│   │   ├── anime_service.py
│   │   ├── episode_service.py
│   │   ├── user_service.py
│   │   └── cache_service.py
│   ├── models/          # SQLAlchemy модели
│   │   ├── anime.py
│   │   ├── episode.py
│   │   ├── user.py
│   │   └── video_source.py
│   └── utils/           # Утилиты
│       ├── security.py      # JWT, хеширование
│       ├── validators.py    # Валидация данных
│       └── helpers.py       # Вспомогательные функции
├── tests/               # Тесты
├── scripts/             # Скрипты развертывания
└── alembic/            # Миграции БД
```

## 🚀 План разработки

### **Phase 1: Основа** ✅
- [x] Базовая структура FastAPI
- [x] Простые mock эндпоинты
- [x] Система запуска
- [x] Документация

### **Phase 2: База данных** 🔄
- [ ] Настройка PostgreSQL
- [ ] SQLAlchemy модели
- [ ] Alembic миграции
- [ ] Redis интеграция

### **Phase 3: Парсеры** 📋
- [ ] AniList API клиент
- [ ] Animepahe парсер
- [ ] GogoAnime парсер
- [ ] Система кеширования

### **Phase 4: API** 📋
- [ ] Anime CRUD API
- [ ] Episode management
- [ ] User authentication
- [ ] Search & filtering

### **Phase 5: Продвинутые функции** 📋
- [ ] Celery задачи
- [ ] Автоматическое обновление
- [ ] Rate limiting
- [ ] Monitoring

## 🛠️ Команды разработки

### **Запуск в dev режиме:**
```bash
# Простой режим (текущий)
./scripts/start_simple.sh

# Полный режим (после настройки БД)
./scripts/start_dev.sh
```

### **Работа с БД:**
```bash
# Создание миграции
alembic revision --autogenerate -m "Add new table"

# Применение миграций
alembic upgrade head

# Откат миграции
alembic downgrade -1
```

### **Тестирование:**
```bash
# Запуск тестов
pytest

# Тесты с покрытием
pytest --cov=app

# Тесты конкретного модуля
pytest tests/test_parsers.py
```

## 📊 Прогресс разработки

- **Общий прогресс**: 25% ✅
- **Структура проекта**: 100% ✅
- **Базовые API**: 30% 🔄
- **Парсеры**: 0% 📋
- **База данных**: 0% 📋
- **Тесты**: 0% 📋

## 🔗 Полезные ссылки

- **AniList API**: https://anilist.gitbook.io/anilist-apiv2-docs/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Alembic**: https://alembic.sqlalchemy.org/
- **Redis**: https://redis.io/documentation

## 📝 Заметки для разработки

- Используем async/await для всех операций
- Все парсеры должны наследоваться от BaseParser
- Обязательное кеширование для внешних API
- Логирование всех операций через loguru
- Валидация данных через Pydantic

---

**Текущая ветка**: `backend-development`  
**Основная ветка**: `main`  
**Слияние**: После завершения фазы разработки
