const STORAGE_KEYS = {
  TOKEN: 'anistand_token',
  USER: 'anistand_user',
  LIBRARY: 'anistand_library',
  WATCH_PROGRESS: 'anistand_watch_progress',
  THEME: 'anistand_theme',
};

export const storage = {
  // Token
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },
  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // User
  getUser: (): any | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: any): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Library
  getLibrary: (): any | null => {
    const library = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    return library ? JSON.parse(library) : null;
  },
  setLibrary: (library: any): void => {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(library));
  },

  // Watch Progress
  getWatchProgress: (animeId: number): any | null => {
    const progress = localStorage.getItem(`${STORAGE_KEYS.WATCH_PROGRESS}_${animeId}`);
    return progress ? JSON.parse(progress) : null;
  },
  setWatchProgress: (animeId: number, progress: any): void => {
    localStorage.setItem(`${STORAGE_KEYS.WATCH_PROGRESS}_${animeId}`, JSON.stringify(progress));
  },

  // Clear all
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
