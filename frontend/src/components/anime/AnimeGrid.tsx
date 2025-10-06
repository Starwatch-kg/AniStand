'use client';

import { Anime } from '@/lib/api';
import AnimeCard from './AnimeCard';
import { Loader2 } from 'lucide-react';

interface AnimeGridProps {
  anime: Anime[];
  loading?: boolean;
  error?: string;
}

export default function AnimeGrid({ anime, loading, error }: AnimeGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-anime-purple" />
        <span className="ml-2 text-gray-600">Загрузка аниме...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">Ошибка загрузки</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!anime || anime.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Аниме не найдено</h3>
          <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {anime.map((item) => (
        <AnimeCard key={item.id} anime={item} />
      ))}
    </div>
  );
}
