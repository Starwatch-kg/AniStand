export interface Comment {
  id: string;
  animeId: number;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  parentId?: string;
}

export interface CommentCreate {
  animeId: number;
  content: string;
  parentId?: string;
}

export interface CommentUpdate {
  content: string;
}

export interface CommentReaction {
  commentId: string;
  type: 'like' | 'dislike';
}
