'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { animeApi, Anime, Genre, AnimeListResponse } from '@/lib/api';
import AnimeGrid from '@/components/anime/AnimeGrid';
import { Search, Filter } from 'lucide-react';

function AnimeCatalogContent() {
  const searchParams = useSearchParams();
  const [anime, setAnime] = useState<Anime[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0,
    limit: 24
  });

  // Фильтры
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    year: '',
    status: '',
    sort: 'popularity'
  });

  // Загрузка жанров
  useEffect(() => {
    loadGenres();
  }, []);

  // Загрузка аниме при изменении фильтров
  useEffect(() => {
    loadAnime();
  }, [filters, pagination.page]);

  const loadGenres = async () => {
    try {
      const genresData = await animeApi.getGenres();
      setGenres(genresData);
    } catch (error) {
      console.error('Ошибка загрузки жанров:', error);
    }
  };

  const loadAnime = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        genre: filters.genre || undefined,
        year: filters.year ? parseInt(filters.year) : undefined,
        status: filters.status || undefined,
        sort: filters.sort
      };

      const response: AnimeListResponse = await animeApi.getList(params);
      
      setAnime(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        pages: response.pages || 0
      }));
    } catch (error) {
      console.error('Ошибка загрузки аниме:', error);
      setError('Не удалось загрузить каталог аниме');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button 
            onClick={loadAnime}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Каталог Аниме
          </h1>
          <p className="text-gray-400">
            Найдите и смотрите любимые аниме онлайн
          </p>
        </div>

        {/* Фильтры */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Поиск */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск аниме..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Жанр */}
            <div>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="">Все жанры</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.name}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Год */}
            <div>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="">Любой год</option>
                {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Сортировка */}
            <div>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="popularity">Популярность</option>
                <option value="rating">Рейтинг</option>
                <option value="year">Год</option>
                <option value="title">Название</option>
              </select>
            </div>
          </div>
        </div>

        {/* Результаты */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Счетчик результатов */}
            <div className="mb-6 text-gray-400">
              Найдено {pagination.total} аниме
            </div>

            {/* Сетка аниме */}
            <AnimeGrid anime={anime} />

            {/* Пагинация */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Назад
                  </button>

                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const page = Math.max(1, pagination.page - 2) + i;
                    if (page > pagination.pages) return null;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          page === pagination.page
                            ? 'text-white bg-purple-600 border border-purple-600'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Вперед
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AnimeCatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка каталога...</div>
      </div>
    }>
      <AnimeCatalogContent />
    </Suspense>
  );
}
