import { apiClient } from './api';
import { UserLibrary, WatchProgress, LibraryStatus } from '@/types';

export const libraryService = {
  async getLibrary(): Promise<UserLibrary> {
    const response = await apiClient.get('/library');
    return response.data;
  },

  async addToLibrary(animeId: number, status: LibraryStatus): Promise<void> {
    await apiClient.post('/library/add', { animeId, status });
  },

  async removeFromLibrary(animeId: number, status: LibraryStatus): Promise<void> {
    await apiClient.post('/library/remove', { animeId, status });
  },

  async updateWatchProgress(progress: WatchProgress): Promise<void> {
    await apiClient.post('/library/progress', progress);
  },

  async getWatchProgress(animeId: number): Promise<WatchProgress | null> {
    const response = await apiClient.get(`/library/progress/${animeId}`);
    return response.data;
  },

  async isInLibrary(animeId: number, status: LibraryStatus): Promise<boolean> {
    const response = await apiClient.get(`/library/check/${animeId}/${status}`);
    return response.data.exists;
  },
};
