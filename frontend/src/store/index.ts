import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import animeReducer from './slices/animeSlice';
import libraryReducer from './slices/librarySlice';
import commentReducer from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    anime: animeReducer,
    library: libraryReducer,
    comments: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
