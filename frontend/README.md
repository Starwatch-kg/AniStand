# 🎌 AniStand Frontend

Современный фронтенд для платформы просмотра аниме, построенный на Next.js с TypeScript и Tailwind CSS.

## 🚀 Особенности

- **Next.js 14** - современный React фреймворк
- **TypeScript** - типобезопасность
- **Tailwind CSS** - утилитарные стили
- **Responsive Design** - адаптивный дизайн
- **API Integration** - интеграция с backend
- **Authentication** - система авторизации

## 📋 Требования

- Node.js 18+
- npm или yarn
- Backend API (запущенный на порту 8000)

## 🛠️ Установка

1. **Установка зависимостей:**
```bash
npm install
```

2. **Настройка переменных окружения:**
```bash
cp .env.local.example .env.local
# Отредактируйте .env.local при необходимости
```

3. **Запуск в режиме разработки:**
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## 🔧 Конфигурация

### Переменные окружения

```env
# API URL для подключения к backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Настройки приложения
NEXT_PUBLIC_APP_NAME=AniStand
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Прокси настройки

В `next.config.js` настроен прокси для API запросов:
- `/api/*` → `http://localhost:8000/api/*`

## 📱 Страницы

### Основные страницы
- **/** - Главная страница с популярными аниме
- **/anime** - Каталог аниме с фильтрами
- **/anime/[id]** - Детальная страница аниме
- **/auth/login** - Страница входа

### Компоненты
- **Header** - Навигация и поиск
- **Footer** - Подвал сайта
- **AnimeCard** - Карточка аниме
- **AnimeGrid** - Сетка аниме

## 🔌 API Интеграция

### API клиент (`src/lib/api.ts`)

```typescript
import { animeApi, episodeApi, authApi, userApi } from '@/lib/api';

// Получить список аниме
const anime = await animeApi.getList({ page: 1, limit: 20 });

// Получить детали аниме
const animeDetail = await animeApi.getDetail(123);

// Авторизация
const loginResponse = await authApi.login({ username, password });
```

### Автоматическая авторизация

API клиент автоматически:
- Добавляет JWT токен к запросам
- Перенаправляет на страницу входа при 401 ошибке
- Обрабатывает ошибки сети

## 🎨 Стили

### Tailwind CSS

Используются кастомные цвета для аниме тематики:
```css
colors: {
  anime: {
    purple: '#6366f1',
    pink: '#ec4899',
    blue: '#3b82f6',
  }
}
```

### Кастомные классы
- `.anime-card` - стили для карточек аниме
- `.gradient-text` - градиентный текст
- `.anime-button` - кнопки в стиле аниме

## 🔍 Функциональность

### Поиск и фильтрация
- Поиск по названию аниме
- Фильтрация по жанрам, годам, статусу
- Сортировка по популярности, рейтингу, году

### Аутентификация
- Вход/регистрация пользователей
- JWT токены
- Защищенные маршруты

### Отображение данных
- Карточки аниме с постерами
- Детальная информация об аниме
- Список эпизодов
- Рейтинги и жанры

## 🚀 Сборка

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Линтинг
```bash
npm run lint
```

## 📁 Структура проекта

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── anime/          # Страницы аниме
│   │   ├── auth/           # Страницы авторизации
│   │   ├── globals.css     # Глобальные стили
│   │   ├── layout.tsx      # Основной layout
│   │   └── page.tsx        # Главная страница
│   ├── components/         # React компоненты
│   │   ├── anime/          # Компоненты аниме
│   │   └── layout/         # Layout компоненты
│   └── lib/
│       └── api.ts          # API клиент
├── public/                 # Статические файлы
├── next.config.js          # Next.js конфигурация
├── tailwind.config.js      # Tailwind конфигурация
└── package.json            # Зависимости
```

## 🔗 Интеграция с Backend

Фронтенд интегрируется с AniStand Backend API:

1. **Подключение**: Через переменную `NEXT_PUBLIC_API_URL`
2. **Авторизация**: JWT токены в localStorage
3. **Прокси**: Next.js прокси для API запросов
4. **Типы**: TypeScript типы для API ответов

### Тестовые данные

Для тестирования используйте:
- **Логин**: testuser
- **Пароль**: test123

## 🐛 Отладка

### Проверка подключения к API
1. Убедитесь, что backend запущен на порту 8000
2. Проверьте переменную `NEXT_PUBLIC_API_URL`
3. Откройте Network tab в браузере для отладки запросов

### Распространенные проблемы
- **CORS ошибки**: Проверьте настройки CORS в backend
- **404 ошибки API**: Убедитесь, что backend запущен
- **Ошибки авторизации**: Проверьте JWT токен в localStorage

## 📄 Лицензия

MIT License

---

**AniStand Frontend** - Современный интерфейс для просмотра аниме 🎌
