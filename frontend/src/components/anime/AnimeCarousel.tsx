import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime } from '@/types';
import { AnimeCard } from './AnimeCard';

interface AnimeCarouselProps {
  title: string;
  animes: Anime[];
}

export const AnimeCarousel: React.FC<AnimeCarouselProps> = ({ title, animes }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!animes || animes.length === 0) return null;

  return (
    <div className="mb-10 px-4 md:px-0">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="relative group/carousel">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-2 rounded-r-lg opacity-0 group-hover/carousel:opacity-100 transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-2 rounded-l-lg opacity-0 group-hover/carousel:opacity-100 transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {animes.map((anime) => (
            <div key={anime.id} className="flex-none w-52">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
