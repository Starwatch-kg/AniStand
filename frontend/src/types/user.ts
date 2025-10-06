export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  email?: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserLibrary {
  favorites: number[];
  watchlist: number[];
  watching: number[];
  completed: number[];
  onHold: number[];
  dropped: number[];
}

export interface WatchProgress {
  animeId: number;
  episodeNumber: number;
  progress: number;
  lastWatched: string;
}

export type LibraryStatus = 'favorites' | 'watchlist' | 'watching' | 'completed' | 'onHold' | 'dropped';
