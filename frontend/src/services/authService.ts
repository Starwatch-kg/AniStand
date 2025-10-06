import { apiClient } from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // FastAPI OAuth2 expects form data
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    // Backend doesn't have logout endpoint, just clear local storage
    return Promise.resolve();
  },

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  async updateProfile(data: Partial<{ username: string; email: string; avatar: string }>): Promise<AuthResponse> {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  },
};
