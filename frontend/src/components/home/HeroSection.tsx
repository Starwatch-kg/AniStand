import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime } from '@/types';
import { sanitizeHTML } from '@/utils/formatters';
import { Button } from '@/components/ui';

interface HeroSectionProps {
  animes: Anime[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ animes }) => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const anime = animes[currentIndex] || animes[0];

  // Автосмена каждые 10 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [currentIndex, animes.length]);

  // Управление видео
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (anime.trailer?.site === 'youtube') {
        // Для YouTube трейлеров можно использовать iframe API
        // Но для простоты используем изображение с эффектом
      }
    }
  }, [isMuted, anime]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % animes.length);
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
      setIsTransitioning(false);
    }, 500);
  };

  const description = sanitizeHTML(anime.description || '');
  const truncatedDescription = description.length > 350 
    ? description.substring(0, 350) + '...' 
    : description;

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background with Video Effect */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent animate-pulse" style={{ animationDuration: '8s' }} />
        
        <img
          src={anime.bannerImage || anime.coverImage.extraLarge}
          alt={anime.title.romaji}
          className="w-full h-full object-cover scale-110 animate-slow-zoom"
        />
        
        {/* Multiple Gradient Layers for Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
        
        {/* Vignette Effect */}
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-3xl space-y-6">
          {/* Minimal Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {anime.title.romaji}
          </h1>
          
          {/* Minimal Stats */}
          <div className="flex items-center gap-3 mb-6">
            {anime.averageScore && (
              <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-white text-base font-semibold">
                  {(anime.averageScore / 10).toFixed(1)}
                </span>
              </div>
            )}
            {anime.seasonYear && (
              <span className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm font-medium">{anime.seasonYear}</span>
            )}
            {anime.episodes && (
              <span className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm font-medium">{anime.episodes} эп.</span>
            )}
          </div>

            {/* Minimal Description */}
            <p className="text-gray-300 text-base mb-6 leading-relaxed max-w-2xl">
              {truncatedDescription}
            </p>

            {/* Minimal Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(`/anime/${anime.id}`)}
                className="flex items-center gap-2"
              >
                <Play size={20} />
                <span className="text-white text-base font-medium">Смотреть</span>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(`/anime/${anime.id}`)}
                className="flex items-center gap-2"
              >
                <Info size={20} />
                Подробнее
              </Button>
            </div>

            {/* Minimal Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {anime.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-md text-white text-xs font-medium hover:bg-white/20 transition-all cursor-pointer"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 backdrop-blur-md hover:bg-black/70 rounded-full text-white transition-all shadow-2xl hover:scale-110 z-10"
        aria-label="Previous anime"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 backdrop-blur-md hover:bg-black/70 rounded-full text-white transition-all shadow-2xl hover:scale-110 z-10"
        aria-label="Next anime"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {animes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-12 bg-primary shadow-lg shadow-primary/50' 
                : 'w-6 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to anime ${index + 1}`}
          />
        ))}
      </div>

      {/* Mute Button with enhanced design */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-8 right-8 p-4 bg-black/50 backdrop-blur-md hover:bg-black/70 rounded-full text-white transition-all shadow-2xl hover:scale-110 z-10"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
      </button>
    </div>
  );
};
