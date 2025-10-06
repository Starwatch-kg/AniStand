import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Anime, AnimeFilters, AnimePage, Episode } from '@/types';
import { animeService } from '@/services/animeService';

interface AnimeState {
  trending: Anime[];
  popular: Anime[];
  currentSeason: Anime[];
  searchResults: AnimePage | null;
  currentAnime: Anime | null;
  episodes: Episode[];
  loading: boolean;
  error: string | null;
  filters: AnimeFilters;
}

const initialState: AnimeState = {
  trending: [],
  popular: [],
  currentSeason: [],
  searchResults: null,
  currentAnime: null,
  episodes: [],
  loading: false,
  error: null,
  filters: {
    page: 1,
    perPage: 20,
    sort: 'POPULARITY_DESC',
  },
};

export const fetchTrending = createAsyncThunk('anime/fetchTrending', async () => {
  return await animeService.getTrending();
});

export const fetchPopular = createAsyncThunk('anime/fetchPopular', async () => {
  return await animeService.getPopular();
});

export const fetchCurrentSeason = createAsyncThunk('anime/fetchCurrentSeason', async () => {
  return await animeService.getCurrentSeason();
});

export const searchAnime = createAsyncThunk<AnimePage, AnimeFilters>(
  'anime/search',
  async (filters) => {
    return await animeService.searchAnime(filters);
  }
);

export const fetchAnimeById = createAsyncThunk<Anime, number>(
  'anime/fetchById',
  async (id) => {
    return await animeService.getAnimeById(id);
  }
);

export const fetchEpisodes = createAsyncThunk<Episode[], number>(
  'anime/fetchEpisodes',
  async (animeId) => {
    return await animeService.getEpisodes(animeId);
  }
);

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<AnimeFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentAnime: (state) => {
      state.currentAnime = null;
      state.episodes = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Trending
    builder.addCase(fetchTrending.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTrending.fulfilled, (state, action) => {
      state.loading = false;
      state.trending = action.payload;
    });
    builder.addCase(fetchTrending.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка загрузки';
    });

    // Popular
    builder.addCase(fetchPopular.fulfilled, (state, action) => {
      state.popular = action.payload;
    });

    // Current Season
    builder.addCase(fetchCurrentSeason.fulfilled, (state, action) => {
      state.currentSeason = action.payload;
    });

    // Search
    builder.addCase(searchAnime.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(searchAnime.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload;
    });
    builder.addCase(searchAnime.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка поиска';
    });

    // Fetch by ID
    builder.addCase(fetchAnimeById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAnimeById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentAnime = action.payload;
    });
    builder.addCase(fetchAnimeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка загрузки аниме';
    });

    // Episodes
    builder.addCase(fetchEpisodes.fulfilled, (state, action) => {
      state.episodes = action.payload;
    });
  },
});

export const { setFilters, clearCurrentAnime, clearError } = animeSlice.actions;
export default animeSlice.reducer;
