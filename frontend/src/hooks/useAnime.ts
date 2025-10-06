import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import {
  fetchTrending,
  fetchPopular,
  fetchCurrentSeason,
  searchAnime,
  fetchAnimeById,
  fetchEpisodes,
  setFilters,
} from '@/store/slices/animeSlice';
import { AnimeFilters } from '@/types';

export const useAnime = () => {
  const dispatch = useAppDispatch();
  const {
    trending,
    popular,
    currentSeason,
    searchResults,
    currentAnime,
    episodes,
    loading,
    error,
    filters,
  } = useAppSelector((state) => state.anime);

  const loadTrending = () => {
    dispatch(fetchTrending());
  };

  const loadPopular = () => {
    dispatch(fetchPopular());
  };

  const loadCurrentSeason = () => {
    dispatch(fetchCurrentSeason());
  };

  const search = (newFilters: Partial<AnimeFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    dispatch(setFilters(updatedFilters));
    dispatch(searchAnime(updatedFilters));
  };

  const loadAnimeById = (id: number) => {
    dispatch(fetchAnimeById(id));
  };

  const loadEpisodes = (animeId: number) => {
    dispatch(fetchEpisodes(animeId));
  };

  return {
    trending,
    popular,
    currentSeason,
    searchResults,
    currentAnime,
    episodes,
    loading,
    error,
    filters,
    loadTrending,
    loadPopular,
    loadCurrentSeason,
    search,
    loadAnimeById,
    loadEpisodes,
  };
};

export const useAnimeDetails = (id: number) => {
  const dispatch = useAppDispatch();
  const { currentAnime, episodes, loading, error } = useAppSelector((state) => state.anime);

  useEffect(() => {
    if (id) {
      dispatch(fetchAnimeById(id));
      dispatch(fetchEpisodes(id));
    }
  }, [id, dispatch]);

  return {
    anime: currentAnime,
    episodes,
    loading,
    error,
  };
};
