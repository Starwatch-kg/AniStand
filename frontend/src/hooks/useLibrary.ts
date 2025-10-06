import { useCallback, useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import {
  fetchLibrary,
  addToLibrary,
  removeFromLibrary,
  updateWatchProgress,
} from '@/store/slices/librarySlice';
import { LibraryStatus, WatchProgress } from '@/types';

export const useLibrary = () => {
  const dispatch = useAppDispatch();
  const { library, watchProgress, loading, error } = useAppSelector((state) => state.library);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchLibrary());
    }
  }, [isAuthenticated, dispatch]);

  const addAnime = useCallback(
    (animeId: number, status: LibraryStatus) => {
      dispatch(addToLibrary({ animeId, status }));
    },
    [dispatch]
  );

  const removeAnime = useCallback(
    (animeId: number, status: LibraryStatus) => {
      dispatch(removeFromLibrary({ animeId, status }));
    },
    [dispatch]
  );

  const updateProgress = useCallback(
    (progress: WatchProgress) => {
      dispatch(updateWatchProgress(progress));
    },
    [dispatch]
  );

  const isInFavorites = useCallback(
    (animeId: number) => {
      return library.favorites.includes(animeId);
    },
    [library.favorites]
  );

  const isInWatchlist = useCallback(
    (animeId: number) => {
      return library.watchlist.includes(animeId);
    },
    [library.watchlist]
  );

  const getAnimeStatus = useCallback(
    (animeId: number): LibraryStatus | null => {
      for (const [status, ids] of Object.entries(library)) {
        if (ids.includes(animeId)) {
          return status as LibraryStatus;
        }
      }
      return null;
    },
    [library]
  );

  return {
    library,
    watchProgress,
    loading,
    error,
    addAnime,
    removeAnime,
    updateProgress,
    isInFavorites,
    isInWatchlist,
    getAnimeStatus,
  };
};
