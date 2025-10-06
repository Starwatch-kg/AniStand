export const API_CONFIG = {
  ANILIST_URL: 'https://graphql.anilist.co',
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
};

export const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Ecchi',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
];

export const SEASONS = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

export const ANIME_STATUS = {
  FINISHED: 'Завершено',
  RELEASING: 'Выходит',
  NOT_YET_RELEASED: 'Анонсировано',
  CANCELLED: 'Отменено',
};

export const ANIME_FORMAT = {
  TV: 'TV Сериал',
  TV_SHORT: 'Короткий',
  MOVIE: 'Фильм',
  SPECIAL: 'Спешл',
  OVA: 'OVA',
  ONA: 'ONA',
  MUSIC: 'Музыка',
};

export const SORT_OPTIONS = [
  { value: 'POPULARITY_DESC', label: 'Популярности' },
  { value: 'SCORE_DESC', label: 'Рейтингу' },
  { value: 'TRENDING_DESC', label: 'В тренде' },
  { value: 'UPDATED_AT_DESC', label: 'Обновлению' },
];

export const LIBRARY_TABS = [
  { id: 'favorites', label: 'Избранное' },
  { id: 'watching', label: 'Смотрю' },
  { id: 'completed', label: 'Просмотрено' },
  { id: 'watchlist', label: 'В планах' },
  { id: 'onHold', label: 'Отложено' },
  { id: 'dropped', label: 'Брошено' },
];

export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  ANIME: '/anime/:id',
  WATCH: '/watch/:id/:episode',
  LIBRARY: '/library',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
};
