import React, { useEffect } from 'react';
import { useAnime } from '@/hooks';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { AnimeCarousel } from '@/components/anime/AnimeCarousel';
import { Loading } from '@/components/ui';

export const Home: React.FC = () => {
  const { trending, popular, currentSeason, loading, loadTrending, loadPopular, loadCurrentSeason } = useAnime();

  useEffect(() => {
    loadTrending();
    loadPopular();
    loadCurrentSeason();
  }, []);

  if (loading && trending.length === 0) {
    return (
      <Layout>
        <Loading fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      {trending.length > 0 && <HeroSection animes={trending.slice(0, 5)} />}
      
      <div className="w-full py-8">
        {currentSeason.length > 0 && (
          <AnimeCarousel title="Сейчас смотрят" animes={currentSeason} />
        )}
        
        {trending.length > 0 && (
          <AnimeCarousel title="С высокой оценкой" animes={trending} />
        )}
        
        {popular.length > 0 && (
          <AnimeCarousel title="Фильмы" animes={popular.filter(a => a.format === 'MOVIE')} />
        )}
      </div>
    </Layout>
  );
};
