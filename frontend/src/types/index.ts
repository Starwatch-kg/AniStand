export * from './anime';
export * from './user';
export * from './comment';

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
