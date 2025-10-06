import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Trash2, Reply, Send, MoreVertical, Flag, Edit } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import { formatTimeAgo } from '@/utils/formatters';
import { Comment } from '@/types';

interface CommentSectionProps {
  animeId: number;
}

type SortOption = 'newest' | 'oldest' | 'popular';

export const CommentSection: React.FC<CommentSectionProps> = ({ animeId }) => {
  const { comments, loading, addComment, removeComment, react } = useComments(animeId);
  const { isAuthenticated, user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      default:
        return 0;
    }
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      await addComment(newComment);
      setNewComment('');
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (replyContent.trim()) {
      await addComment(replyContent, parentId);
      setReplyContent('');
      setReplyTo(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      await removeComment(commentId);
    }
  };

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply = false }) => {
    const isOwner = user?.id === comment.userId;
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    const handleReact = async (type: 'like' | 'dislike') => {
      await react(comment.id, type);
      if (type === 'like') {
        setIsLiked(!isLiked);
        if (isDisliked) setIsDisliked(false);
      } else {
        setIsDisliked(!isDisliked);
        if (isLiked) setIsLiked(false);
      }
    };

    return (
      <div className={`${isReply ? 'ml-12' : ''} mb-4 animate-slide-up`}>
        <div className="bg-dark-card rounded-lg p-4 hover:bg-dark-lighter transition-colors">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold flex-shrink-0">
              {comment.username.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{comment.username}</span>
                  {isOwner && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                      Вы
                    </span>
                  )}
                  <span className="text-gray-500 text-sm">{formatTimeAgo(comment.createdAt)}</span>
                </div>

                {/* Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === comment.id ? null : comment.id)}
                    className="p-1 hover:bg-dark-lighter rounded transition-colors"
                  >
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>

                  {showMenu === comment.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-dark-card border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10 animate-scale-in">
                      {isOwner ? (
                        <>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-dark-lighter transition-colors">
                            <Edit size={16} />
                            <span className="text-sm">Редактировать</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(comment.id);
                              setShowMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-dark-lighter transition-colors"
                          >
                            <Trash2 size={16} />
                            <span className="text-sm">Удалить</span>
                          </button>
                        </>
                      ) : (
                        <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-dark-lighter transition-colors">
                          <Flag size={16} />
                          <span className="text-sm">Пожаловаться</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-3 leading-relaxed">{comment.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleReact('like')}
                  className={`flex items-center gap-1 transition-colors ${
                    isLiked ? 'text-primary' : 'text-gray-400 hover:text-primary'
                  }`}
                >
                  <ThumbsUp size={16} className={isLiked ? 'fill-current' : ''} />
                  <span className="text-sm font-medium">{comment.likes}</span>
                </button>

                <button
                  onClick={() => handleReact('dislike')}
                  className={`flex items-center gap-1 transition-colors ${
                    isDisliked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <ThumbsDown size={16} className={isDisliked ? 'fill-current' : ''} />
                  <span className="text-sm font-medium">{comment.dislikes}</span>
                </button>

                {!isReply && isAuthenticated && (
                  <button
                    onClick={() => setReplyTo(comment.id)}
                    className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Reply size={16} />
                    <span className="text-sm">Ответить</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {replyTo === comment.id && (
          <div className="ml-12 mt-3 animate-slide-up">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 flex gap-2">
                <Input
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Ответить ${comment.username}...`}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitReply(comment.id);
                    }
                  }}
                />
                <Button
                  onClick={() => handleSubmitReply(comment.id)}
                  variant="primary"
                  disabled={!replyContent.trim()}
                >
                  <Send size={18} />
                </Button>
                <Button onClick={() => setReplyTo(null)} variant="ghost">
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="text-primary" size={28} />
          <h3 className="text-2xl font-bold text-white">
            Комментарии
            <span className="ml-2 text-gray-400 text-lg">({comments.length})</span>
          </h3>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Сортировка:</span>
          <div className="flex gap-1 bg-dark-card rounded-lg p-1">
            {[
              { value: 'newest', label: 'Новые' },
              { value: 'popular', label: 'Популярные' },
              { value: 'oldest', label: 'Старые' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === option.value
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Поделитесь своим мнением..."
                className="w-full px-4 py-3 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none transition-colors"
                rows={3}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSubmitComment(e);
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-500 text-xs">
                  Ctrl + Enter для отправки
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!newComment.trim()}
                  className="flex items-center gap-2"
                >
                  <Send size={16} />
                  Отправить
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-dark-card rounded-lg p-6 mb-8 text-center border border-gray-700">
          <MessageCircle className="mx-auto mb-3 text-gray-600" size={48} />
          <p className="text-gray-400 mb-4">
            Войдите, чтобы оставить комментарий и участвовать в обсуждении
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/login'}>
            Войти
          </Button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка комментариев...</p>
        </div>
      ) : sortedComments.length > 0 ? (
        <div className="space-y-4">
          {sortedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="mx-auto mb-4 text-gray-600" size={64} />
          <p className="text-gray-400 text-lg mb-2">Пока нет комментариев</p>
          <p className="text-gray-500">Будьте первым, кто оставит комментарий!</p>
        </div>
      )}
    </div>
  );
};
