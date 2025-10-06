import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime } from '@/types';
import { Button } from '@/components/ui';
import { formatScore, sanitizeHTML } from '@/utils/formatters';

interface HeroSectionProps {
  animes: Anime[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ animes }) => {
  const navigate = useNavigate();
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
    <div className="relative h-[90vh] w-full overflow-hidden bg-black">
      {/* Background with Enhanced Effects */}
      <div className={`absolute inset-0 transition-all duration-1000 ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-900/20 to-transparent animate-gradient" />
        
        {/* Main Image with Parallax Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large}
            alt={anime.title.romaji}
            className="w-full h-full object-cover scale-110 animate-slow-zoom filter brightness-90"
            loading="eager"
          />
        </div>
        
        {/* Enhanced Multiple Gradient Layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-900/10" />
        
        {/* Vignette & Noise Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)] opacity-60" />
      </div>

      {/* Content with Enhanced Typography */}
      <div className="relative h-full container mx-auto px-6 lg:px-8 flex items-center">
        <div className="max-w-4xl space-y-8 animate-slide-fade-in">
          {/* Enhanced Title with Gradient */}
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-tight tracking-tight">
              <span className="inline-block hover:text-gradient-animated transition-all duration-300">
                {anime.title.romaji}
              </span>
            </h1>
            {anime.title.english && anime.title.english !== anime.title.romaji && (
              <p className="text-xl md:text-2xl text-gray-400 font-medium">
                {anime.title.english}
              </p>
            )}
          </div>
          
          {/* Enhanced Stats with Glass Effect */}
          <div className="flex items-center gap-4 mb-6">
            {anime.averageScore && (
              <div className="flex items-center gap-2 px-5 py-3 glass-morphism rounded-xl shadow-depth-sm hover:shadow-primary transition-all hover:scale-105">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="text-white text-lg font-bold">
                  {(anime.averageScore / 10).toFixed(1)}
                </span>
              </div>
            )}
            {anime.seasonYear && (
              <span className="px-5 py-3 glass-morphism rounded-xl text-white text-base font-semibold hover:scale-105 transition-transform">{anime.seasonYear}</span>
            )}
            {anime.episodes && (
              <span className="px-5 py-3 glass-morphism rounded-xl text-white text-base font-semibold hover:scale-105 transition-transform">{anime.episodes} эпизодов</span>
            )}
            {anime.format && (
              <span className="px-5 py-3 glass-morphism rounded-xl text-white text-base font-semibold hover:scale-105 transition-transform">{anime.format}</span>
            )}
          </div>

          {/* Enhanced Description */}
          <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed max-w-3xl font-light">
            {truncatedDescription}
          </p>

          {/* Enhanced Buttons with Glow */}
          <div className="flex gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/watch/${anime.id}/1`)}
              className="flex items-center gap-3 px-8 py-4 text-lg font-bold hover-glow shadow-primary-lg hover:scale-105 transition-all"
            >
              <Play size={24} className="fill-current" />
              <span>Смотреть сейчас</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(`/anime/${anime.id}`)}
              className="flex items-center gap-3 px-8 py-4 text-lg font-bold glass-morphism hover:glass-effect-strong hover:scale-105 transition-all"
            >
              <Info size={24} />
              Подробнее
            </Button>
          </div>

          {/* Enhanced Genres with Hover Effects */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {anime.genres.slice(0, 5).map((genre, index) => (
                <span
                  key={genre}
                  className="px-4 py-2 glass-morphism rounded-lg text-white text-sm font-semibold hover:bg-primary/30 hover:scale-110 transition-all cursor-pointer border border-white/10 hover:border-primary/50 animate-slide-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-5 glass-morphism hover:bg-white/20 rounded-full text-white transition-all shadow-depth-lg hover:scale-125 hover:shadow-primary z-10 group"
        aria-label="Previous anime"
      >
        <ChevronLeft size={36} className="group-hover:-translate-x-1 transition-transform" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-5 glass-morphism hover:bg-white/20 rounded-full text-white transition-all shadow-depth-lg hover:scale-125 hover:shadow-primary z-10 group"
        aria-label="Next anime"
      >
        <ChevronRight size={36} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Enhanced Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {animes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-16 bg-gradient-to-r from-primary to-primary-light shadow-lg shadow-primary/70 animate-pulse' 
                : 'w-8 bg-white/40 hover:bg-white/60 hover:w-12'
            }`}
            aria-label={`Go to anime ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
};
