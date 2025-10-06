import { apiClient } from './api';
import { UserLibrary, WatchProgress, LibraryStatus } from '@/types';

export const libraryService = {
  async getLibrary(): Promise<UserLibrary> {
    try {
      const [favorites, history] = await Promise.all([
        apiClient.get('/users/favorites'),
        apiClient.get('/users/history'),
      ]);
      
      return {
        favorites: favorites.data.map((a: any) => a.id) || [],
        watchlist: [],
        watching: history.data.map((h: any) => h.anime_id) || [],
        completed: [],
        onHold: [],
        dropped: [],
      };
    } catch (error) {
      console.error('Error fetching library:', error);
      return {
        favorites: [],
        watchlist: [],
        watching: [],
        completed: [],
        onHold: [],
        dropped: [],
      };
    }
  },

  async addToLibrary(animeId: number, status: LibraryStatus): Promise<void> {
    if (status === 'favorites') {
      await apiClient.post('/users/favorites', { anime_id: animeId });
    }
  },

  async removeFromLibrary(animeId: number, status: LibraryStatus): Promise<void> {
    if (status === 'favorites') {
      await apiClient.delete(`/users/favorites/${animeId}`);
    }
  },

  async updateWatchProgress(progress: WatchProgress): Promise<void> {
    await apiClient.post(`/episodes/${progress.episodeNumber}/progress`, {
      progress: progress.progress,
      completed: progress.progress >= 90,
    });
  },

  async getWatchProgress(animeId: number): Promise<WatchProgress | null> {
    try {
      const response = await apiClient.get('/users/history');
      const history = response.data.find((h: any) => h.anime_id === animeId);
      return history || null;
    } catch (error) {
      return null;
    }
  },

  async isInLibrary(animeId: number, status: LibraryStatus): Promise<boolean> {
    try {
      if (status === 'favorites') {
        const response = await apiClient.get('/users/favorites');
        return response.data.some((a: any) => a.id === animeId);
      }
      return false;
    } catch (error) {
      return false;
    }
  },
};
