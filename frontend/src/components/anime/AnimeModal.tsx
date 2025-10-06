import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Plus, Star } from 'lucide-react';
import { Anime } from '@/types';
import { Button } from '@/components/ui';
import { formatScore } from '@/utils/formatters';

interface AnimeModalProps {
  anime: Anime;
  isOpen: boolean;
  onClose: () => void;
}

export const AnimeModal: React.FC<AnimeModalProps> = ({ anime, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Небольшая задержка для плавной анимации
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWatch = () => {
    navigate(`/watch/${anime.id}/1`);
    onClose();
  };

  const handleViewDetails = () => {
    navigate(`/anime/${anime.id}`);
    onClose();
  };

  const description = anime.description?.replace(/<[^>]*>/g, '') || '';
  const truncatedDescription = description.length > 300 
    ? description.substring(0, 300) + '...' 
    : description;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-end justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`} />

      {/* Modal Content - Slides UP from BOTTOM of screen */}
      <div 
        className={`relative w-full max-w-7xl bg-dark-900 rounded-t-3xl overflow-hidden shadow-depth-xl border-t border-white/10 max-h-[75vh] overflow-y-auto custom-scrollbar transform transition-transform duration-500 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-3 bg-black/80 backdrop-blur-md hover:bg-primary rounded-full text-white transition-all hover:scale-110 shadow-2xl hover:rotate-90"
        >
          <X size={28} />
        </button>

        {/* Compact Background Image */}
        <div className="relative h-[35vh] sm:h-[40vh] md:h-[45vh] overflow-hidden">
          <div className="absolute inset-0 scale-110">
            <img
              src={anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large}
              alt={anime.title.romaji}
              className="w-full h-full object-cover animate-slow-zoom"
              loading="eager"
            />
          </div>
          
          {/* Strong Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)] opacity-50" />
          
          {/* Content Overlay - Compact */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-4 sm:p-5 md:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
                {/* Poster - Smaller */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <div className="relative group">
                    <img
                      src={anime.coverImage.extraLarge}
                      alt={anime.title.romaji}
                      className="w-28 h-40 sm:w-32 sm:h-48 md:w-36 md:h-52 lg:w-40 lg:h-60 object-cover rounded-xl shadow-2xl border-2 border-white/20 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Info Section - Compact */}
                <div className="flex-1 space-y-2 sm:space-y-3">
                  {/* Title - Compact */}
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-2xl">
                      {anime.title.romaji}
                    </h2>
                    {anime.title.english && anime.title.english !== anime.title.romaji && (
                      <p className="text-sm sm:text-base md:text-lg text-gray-300 font-medium">
                        {anime.title.english}
                      </p>
                    )}
                  </div>

                  {/* Stats Row - Very Compact */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {anime.averageScore && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-yellow-400/30">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-bold text-xs sm:text-sm">
                          {formatScore(anime.averageScore)}
                        </span>
                      </div>
                    )}
                    {anime.seasonYear && (
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20">
                        <span className="text-white font-semibold text-xs">{anime.seasonYear}</span>
                      </div>
                    )}
                    {anime.episodes && (
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20">
                        <span className="text-white font-semibold text-xs">{anime.episodes} эп.</span>
                      </div>
                    )}
                    {anime.format && (
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20">
                        <span className="text-white font-semibold text-xs">{anime.format}</span>
                      </div>
                    )}
                  </div>

                  {/* Description - Compact */}
                  <p className="text-gray-200 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {truncatedDescription}
                  </p>

                  {/* Genres - Very Compact */}
                  {anime.genres && anime.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {anime.genres.slice(0, 4).map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md text-white text-xs font-medium border border-white/20 hover:bg-primary/30 hover:border-primary transition-all"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons - Compact */}
                  <div className="flex flex-col xs:flex-row gap-2 pt-1">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleWatch}
                      className="flex items-center justify-center gap-2 text-sm sm:text-base font-black hover-glow shadow-primary-lg py-2.5 sm:py-3"
                    >
                      <Play size={18} className="fill-current sm:w-5 sm:h-5" />
                      <span>Смотреть</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={handleViewDetails}
                      className="flex items-center justify-center gap-2 text-sm sm:text-base font-bold py-2.5 sm:py-3"
                    >
                      <Plus size={18} className="sm:w-5 sm:h-5" />
                      <span>Подробнее</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
