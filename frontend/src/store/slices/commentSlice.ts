import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Comment, CommentCreate, CommentReaction } from '@/types';
import { commentService } from '@/services/commentService';

interface CommentState {
  comments: Record<number, Comment[]>;
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: {},
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk<Comment[], number>(
  'comments/fetch',
  async (animeId) => {
    return await commentService.getComments(animeId);
  }
);

export const createComment = createAsyncThunk<Comment, CommentCreate>(
  'comments/create',
  async (commentData) => {
    return await commentService.createComment(commentData);
  }
);

export const deleteComment = createAsyncThunk<string, string>(
  'comments/delete',
  async (commentId) => {
    await commentService.deleteComment(commentId);
    return commentId;
  }
);

export const reactToComment = createAsyncThunk<
  { commentId: string; type: 'like' | 'dislike' },
  CommentReaction
>('comments/react', async (reaction) => {
  await commentService.reactToComment(reaction);
  return reaction;
});

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state, action: PayloadAction<number>) => {
      delete state.comments[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch comments
    builder.addCase(fetchComments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.loading = false;
      const animeId = action.meta.arg;
      state.comments[animeId] = action.payload;
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка загрузки комментариев';
    });

    // Create comment
    builder.addCase(createComment.fulfilled, (state, action) => {
      const comment = action.payload;
      if (!state.comments[comment.animeId]) {
        state.comments[comment.animeId] = [];
      }
      if (comment.parentId) {
        // Add as reply
        const parentComment = state.comments[comment.animeId].find(c => c.id === comment.parentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(comment);
        }
      } else {
        // Add as top-level comment
        state.comments[comment.animeId].unshift(comment);
      }
    });

    // Delete comment
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      const commentId = action.payload;
      Object.keys(state.comments).forEach(animeId => {
        state.comments[Number(animeId)] = state.comments[Number(animeId)].filter(
          c => c.id !== commentId
        );
      });
    });

    // React to comment
    builder.addCase(reactToComment.fulfilled, (state, action) => {
      const { commentId, type } = action.payload;
      Object.keys(state.comments).forEach(animeId => {
        const comment = state.comments[Number(animeId)].find(c => c.id === commentId);
        if (comment) {
          if (type === 'like') {
            comment.likes += 1;
          } else {
            comment.dislikes += 1;
          }
        }
      });
    });
  },
});

export const { clearComments, clearError } = commentSlice.actions;
export default commentSlice.reducer;
