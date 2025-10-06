import axios from 'axios';

// API клиент для связи с backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсептор для добавления токена авторизации
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерсептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Типы данных
export interface Anime {
  id: number;
  title_romaji: string;
  title_english?: string;
  title_native?: string;
  description?: string;
  cover_image?: string;
  banner_image?: string;
  episodes?: number;
  duration?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  season?: string;
  season_year?: number;
  average_score?: number;
  popularity?: number;
  is_adult?: boolean;
  genres?: Genre[];
  studios?: Studio[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Studio {
  id: number;
  name: string;
}

export interface Episode {
  id: number;
  anime_id: number;
  episode_number: number;
  title?: string;
  description?: string;
  air_date?: string;
  duration?: number;
  thumbnail?: string;
  video_sources?: VideoSource[];
}

export interface VideoSource {
  id: number;
  episode_id: number;
  source_name: string;
  video_url: string;
  quality?: string;
  subtitle_url?: string;
  is_active: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnimeListResponse {
  data: Anime[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// API функции
export const animeApi = {
  // Получить список аниме
  getList: async (params?: {
    page?: number;
    limit?: number;
    genre?: string;
    year?: number;
    status?: string;
    sort?: string;
  }): Promise<AnimeListResponse> => {
    const response = await apiClient.get('/api/v1/anime/', { params });
    return response.data;
  },

  // Получить детали аниме
  getDetail: async (id: number): Promise<Anime> => {
    const response = await apiClient.get(`/api/v1/anime/${id}`);
    return response.data;
  },

  // Поиск аниме
  search: async (query: string, limit: number = 10): Promise<Anime[]> => {
    const response = await apiClient.get('/api/v1/anime/search', {
      params: { q: query, limit }
    });
    return response.data;
  },

  // Получить жанры
  getGenres: async (): Promise<Genre[]> => {
    const response = await apiClient.get('/api/v1/anime/genres/');
    return response.data;
  },

  // Получить студии
  getStudios: async (): Promise<Studio[]> => {
    const response = await apiClient.get('/api/v1/anime/studios/');
    return response.data;
  },
};

export const episodeApi = {
  // Получить эпизоды аниме
  getByAnime: async (animeId: number): Promise<{ data: Episode[]; total: number }> => {
    const response = await apiClient.get(`/api/v1/episodes/anime/${animeId}`);
    return response.data;
  },

  // Получить детали эпизода
  getDetail: async (id: number): Promise<Episode> => {
    const response = await apiClient.get(`/api/v1/episodes/${id}`);
    return response.data;
  },

  // Получить источники видео (требует авторизации)
  getSources: async (episodeId: number): Promise<{ episode_id: number; sources: VideoSource[] }> => {
    const response = await apiClient.get(`/api/v1/episodes/${episodeId}/sources`);
    return response.data;
  },

  // Сохранить прогресс просмотра
  saveProgress: async (episodeId: number, progress: number, completed: boolean = false): Promise<void> => {
    await apiClient.post(`/api/v1/episodes/${episodeId}/progress`, {
      progress,
      completed
    });
  },
};

export const authApi = {
  // Регистрация
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await apiClient.post('/api/v1/auth/register', userData);
    return response.data;
  },

  // Вход
  login: async (credentials: { username: string; password: string }) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await apiClient.post('/api/v1/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },

  // Обновление токена
  refresh: async () => {
    const response = await apiClient.post('/api/v1/auth/refresh');
    return response.data;
  },
};

export const userApi = {
  // Получить профиль
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/api/v1/users/me');
    return response.data;
  },

  // Обновить профиль
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put('/api/v1/users/me', userData);
    return response.data;
  },

  // Добавить в избранное
  addToFavorites: async (animeId: number): Promise<void> => {
    await apiClient.post('/api/v1/users/favorites', { anime_id: animeId });
  },

  // Удалить из избранного
  removeFromFavorites: async (animeId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/users/favorites/${animeId}`);
  },

  // Получить избранное
  getFavorites: async (): Promise<Anime[]> => {
    const response = await apiClient.get('/api/v1/users/favorites');
    return response.data;
  },

  // Получить историю просмотров
  getHistory: async () => {
    const response = await apiClient.get('/api/v1/users/history');
    return response.data;
  },
};

// Проверка здоровья API
export const healthCheck = async (): Promise<{ status: string; service: string }> => {
  const response = await apiClient.get('/health');
  return response.data;
};
