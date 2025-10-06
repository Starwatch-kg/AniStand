import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserLibrary, WatchProgress, LibraryStatus } from '@/types';
import { libraryService } from '@/services/libraryService';
import { storage } from '@/utils/storage';

interface LibraryState {
  library: UserLibrary;
  watchProgress: Record<number, WatchProgress>;
  loading: boolean;
  error: string | null;
}

const initialState: LibraryState = {
  library: storage.getLibrary() || {
    favorites: [],
    watchlist: [],
    watching: [],
    completed: [],
    onHold: [],
    dropped: [],
  },
  watchProgress: {},
  loading: false,
  error: null,
};

export const fetchLibrary = createAsyncThunk('library/fetch', async () => {
  return await libraryService.getLibrary();
});

export const addToLibrary = createAsyncThunk<
  { animeId: number; status: LibraryStatus },
  { animeId: number; status: LibraryStatus }
>('library/add', async ({ animeId, status }) => {
  await libraryService.addToLibrary(animeId, status);
  return { animeId, status };
});

export const removeFromLibrary = createAsyncThunk<
  { animeId: number; status: LibraryStatus },
  { animeId: number; status: LibraryStatus }
>('library/remove', async ({ animeId, status }) => {
  await libraryService.removeFromLibrary(animeId, status);
  return { animeId, status };
});

export const updateWatchProgress = createAsyncThunk<WatchProgress, WatchProgress>(
  'library/updateProgress',
  async (progress) => {
    await libraryService.updateWatchProgress(progress);
    return progress;
  }
);

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setLibrary: (state, action: PayloadAction<UserLibrary>) => {
      state.library = action.payload;
      storage.setLibrary(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch library
    builder.addCase(fetchLibrary.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLibrary.fulfilled, (state, action) => {
      state.loading = false;
      state.library = action.payload;
      storage.setLibrary(action.payload);
    });
    builder.addCase(fetchLibrary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка загрузки библиотеки';
    });

    // Add to library
    builder.addCase(addToLibrary.fulfilled, (state, action) => {
      const { animeId, status } = action.payload;
      if (!state.library[status].includes(animeId)) {
        state.library[status].push(animeId);
        storage.setLibrary(state.library);
      }
    });

    // Remove from library
    builder.addCase(removeFromLibrary.fulfilled, (state, action) => {
      const { animeId, status } = action.payload;
      state.library[status] = state.library[status].filter(id => id !== animeId);
      storage.setLibrary(state.library);
    });

    // Update watch progress
    builder.addCase(updateWatchProgress.fulfilled, (state, action) => {
      const progress = action.payload;
      state.watchProgress[progress.animeId] = progress;
      storage.setWatchProgress(progress.animeId, progress);
    });
  },
});

export const { setLibrary, clearError } = librarySlice.actions;
export default librarySlice.reducer;
