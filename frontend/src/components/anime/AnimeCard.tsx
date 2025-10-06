import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, Heart, Plus, Eye } from 'lucide-react';
import { Anime } from '@/types';
import { formatScore } from '@/utils/formatters';
import { Card } from '@/components/ui';
import { useLibrary } from '@/hooks';
import { AnimeModal } from './AnimeModal';

interface AnimeCardProps {
  anime: Anime;
  showQuickActions?: boolean;
  layout?: 'grid' | 'list';
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  showQuickActions = true,
  layout = 'grid',
}) => {
  const navigate = useNavigate();
  const { isInFavorites, addAnime, removeAnime } = useLibrary();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isFavorite = isInFavorites(anime.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeAnime(anime.id, 'favorites');
    } else {
      addAnime(anime.id, 'favorites');
    }
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    addAnime(anime.id, 'watchlist');
  };

  const handleWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch/${anime.id}/1`);
  };

  const handleViewDetails = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowModal(true);
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  if (layout === 'list') {
    return (
      <div
        onClick={handleViewDetails}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-dark-card rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer group"
      >
        <div className="flex gap-4 p-4">
          {/* Poster */}
          <div className="relative w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={anime.coverImage.extraLarge || anime.coverImage.large}
              alt={anime.title.romaji}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            {anime.averageScore && (
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white text-xs font-semibold">
                  {formatScore(anime.averageScore)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
              {anime.title.romaji}
            </h3>
            {anime.title.english && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-1">
                {anime.title.english}
              </p>
            )}
            <p className="text-gray-300 text-sm mb-3 line-clamp-3">
              {anime.description?.replace(/<[^>]*>/g, '')}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {anime.genres?.slice(0, 4).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-dark-lighter text-gray-300 text-xs rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {anime.episodes && (
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {anime.episodes} эп.
                </span>
              )}
              {anime.seasonYear && <span>{anime.seasonYear}</span>}
            </div>
          </div>

          {/* Actions */}
          {showQuickActions && isHovered && (
            <div className="flex flex-col gap-2 animate-scale-in">
              <button
                onClick={handleWatch}
                className="p-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                title="Смотреть"
              >
                <Play size={20} />
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-dark-lighter hover:bg-gray-700 text-gray-300'
                }`}
                title={isFavorite ? 'Удалить из избранного' : 'В избранное'}
              >
                <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
              </button>
              <button
                onClick={handleAddToList}
                className="p-2 bg-dark-lighter hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                title="Добавить в список"
              >
                <Plus size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimeModal 
        anime={anime} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
      
      <Card
        hover
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden shadow-depth-md hover:shadow-primary-lg transition-all duration-500 rounded-2xl cursor-pointer border border-white/5 hover:border-primary/50 hover:-translate-y-2"
      >
      {/* Poster */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-800">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={anime.coverImage.extraLarge || anime.coverImage.large}
          alt={anime.title.romaji}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          } group-hover:scale-105 group-hover:brightness-105`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

        {/* Compact Rating Badge - Top Right */}
        {anime.averageScore && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-bold">
              {formatScore(anime.averageScore)}
            </span>
          </div>
        )}

        {/* Compact Episodes Badge - Top Left */}
        {anime.episodes && (
          <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg">
            <span className="text-white text-xs font-bold">
              {anime.episodes}
            </span>
          </div>
        )}

        {/* Title Overlay at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
          <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight mb-1">
            {anime.title.romaji}
          </h3>
          {anime.seasonYear && (
            <p className="text-gray-400 text-xs">
              {anime.seasonYear}
            </p>
          )}
        </div>

        {/* Favorite Button - Hidden by default, shows on hover */}
        <button
          onClick={handleToggleFavorite}
          className={`
            absolute top-2 right-2 p-2 rounded-full transition-all duration-300 shadow-lg
            ${isFavorite
              ? 'bg-red-500 text-white opacity-100'
              : 'bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100'
            }
            hover:scale-110
          `}
          title={isFavorite ? 'Удалить из избранного' : 'В избранное'}
        >
          <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>
    </Card>
    </>
  );
};
