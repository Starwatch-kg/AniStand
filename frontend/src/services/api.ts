import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '@/utils/constants';
import { storage } from '@/utils/storage';

// Create axios instance for backend API
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.clearAll();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AniList GraphQL API
const ANILIST_API_URL = 'https://graphql.anilist.co';
const JIKAN_API_URL = 'https://api.jikan.moe/v4';

export const anilistClient = axios.create({
  baseURL: ANILIST_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const jikanClient = axios.create({
  baseURL: JIKAN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
