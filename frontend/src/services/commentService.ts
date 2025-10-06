import { apiClient } from './api';
import { Comment, CommentCreate, CommentUpdate, CommentReaction } from '@/types';

export const commentService = {
  async getComments(animeId: number): Promise<Comment[]> {
    const response = await apiClient.get(`/comments/anime/${animeId}`);
    return response.data.data || [];
  },

  async createComment(commentData: CommentCreate): Promise<Comment> {
    const response = await apiClient.post('/comments/', commentData);
    return response.data;
  },

  async updateComment(commentId: string, data: CommentUpdate): Promise<Comment> {
    const response = await apiClient.put(`/comments/${commentId}`, data);
    return response.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`);
  },

  async reactToComment(reaction: CommentReaction): Promise<void> {
    await apiClient.post(`/comments/${reaction.commentId}/react`, { type: reaction.type });
  },
};
