import { useEffect, useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import {
  fetchComments,
  createComment,
  deleteComment,
  reactToComment,
} from '@/store/slices/commentSlice';
import { CommentCreate, CommentReaction } from '@/types';

export const useComments = (animeId: number) => {
  const dispatch = useAppDispatch();
  const { comments, loading, error } = useAppSelector((state) => state.comments);
  const animeComments = comments[animeId] || [];

  useEffect(() => {
    if (animeId) {
      dispatch(fetchComments(animeId));
    }
  }, [animeId, dispatch]);

  const addComment = useCallback(
    async (content: string, parentId?: string) => {
      const commentData: CommentCreate = {
        animeId,
        content,
        parentId,
      };
      await dispatch(createComment(commentData));
    },
    [animeId, dispatch]
  );

  const removeComment = useCallback(
    async (commentId: string) => {
      await dispatch(deleteComment(commentId));
    },
    [dispatch]
  );

  const react = useCallback(
    async (commentId: string, type: 'like' | 'dislike') => {
      const reaction: CommentReaction = { commentId, type };
      await dispatch(reactToComment(reaction));
    },
    [dispatch]
  );

  return {
    comments: animeComments,
    loading,
    error,
    addComment,
    removeComment,
    react,
  };
};
