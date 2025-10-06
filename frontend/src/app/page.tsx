'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, TrendingUp, Star, Calendar } from 'lucide-react';
import { animeService } from '@/services/animeService';
import { Anime } from '@/types/anime';
import { apiClient } from '@/services/api';
import AnimeGrid from '@/components/anime/AnimeGrid';

export default function HomePage() {
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [recentAnime, setRecentAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Проверяем статус API
        await apiClient.get('/health');
        setApiStatus('online');

        // Загружаем популярные аниме через backend
        const popularResponse = await animeService.getAnimeListFromBackend({
          page: 1,
          perPage: 12,
          sort: 'POPULARITY_DESC'
        });
        setPopularAnime(popularResponse.media);

        // Загружаем недавние аниме через backend
        const recentResponse = await animeService.getAnimeListFromBackend({
          page: 1,
          perPage: 12,
          sort: 'UPDATED_AT_DESC'
        });
        setRecentAnime(recentResponse.media);

      } catch (err) {
        console.error('Error loading data:', err);
        setApiStatus('offline');
        setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-anime-purple via-anime-blue to-anime-pink text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Добро пожаловать в <span className="text-yellow-300">AniStand</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Смотрите любимые аниме онлайн в высоком качестве. 
            Тысячи аниме, удобный интерфейс, без рекламы.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/anime" className="bg-white text-anime-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
              <Play className="h-5 w-5 mr-2" />
              Начать просмотр
            </Link>
            <Link href="/top" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-anime-purple transition-colors inline-flex items-center justify-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Топ аниме
            </Link>
          </div>
        </div>
      </section>

      {/* API Status */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              apiStatus === 'online' ? 'bg-green-500' : 
              apiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-gray-600 dark:text-gray-400">
              API Status: {
                apiStatus === 'online' ? 'Онлайн' :
                apiStatus === 'offline' ? 'Офлайн' : 'Проверка...'
              }
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Popular Anime Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-8 w-8 text-anime-purple mr-3" />
              Популярные аниме
            </h2>
            <Link 
              href="/anime?sort=popularity" 
              className="text-anime-purple hover:text-anime-pink font-medium transition-colors"
            >
              Смотреть все →
            </Link>
          </div>
          
          <AnimeGrid 
            anime={popularAnime} 
            loading={loading && apiStatus !== 'offline'} 
            error={apiStatus === 'offline' ? error : ''} 
          />
        </section>

        {/* Recent Anime Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Calendar className="h-8 w-8 text-anime-purple mr-3" />
              Недавние релизы
            </h2>
            <Link 
              href="/anime?sort=year" 
              className="text-anime-purple hover:text-anime-pink font-medium transition-colors"
            >
              Смотреть все →
            </Link>
          </div>
          
          <AnimeGrid 
            anime={recentAnime} 
            loading={loading && apiStatus !== 'offline'} 
            error={apiStatus === 'offline' ? error : ''} 
          />
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-gradient-to-r from-anime-purple to-anime-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Высокое качество</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Смотрите аниме в качестве до 1080p с быстрой загрузкой
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-gradient-to-r from-anime-purple to-anime-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Большая библиотека</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Тысячи аниме всех жанров и годов выпуска
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-gradient-to-r from-anime-purple to-anime-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Удобный интерфейс</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Современный дизайн и интуитивная навигация
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
