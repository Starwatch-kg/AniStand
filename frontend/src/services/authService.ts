import { apiClient } from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async updateProfile(data: Partial<{ username: string; email: string; avatar: string }>): Promise<AuthResponse> {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },
};
