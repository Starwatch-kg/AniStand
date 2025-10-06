'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List } from 'lucide-react';
import { animeApi, Anime, Genre, AnimeListResponse } from '@/lib/api';
import AnimeGrid from '@/components/anime/AnimeGrid';

export default function AnimeCatalogPage() {
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
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || 'popularity'
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    loadAnime();
  }, [filters, pagination.page]);

  const loadGenres = async () => {
    try {
      const genresData = await animeApi.getGenres();
      setGenres(genresData);
    } catch (err) {
      console.error('Error loading genres:', err);
    }
  };

  const loadAnime = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sort: filters.sort
      };

      if (filters.genre) params.genre = filters.genre;
      if (filters.year) params.year = parseInt(filters.year);
      if (filters.status) params.status = filters.status;

      const response: AnimeListResponse = await animeApi.getList(params);
      setAnime(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        pages: response.pages
      }));
      setError('');
    } catch (err) {
      console.error('Error loading anime:', err);
      setError('Не удалось загрузить аниме');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Каталог аниме
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {pagination.total > 0 ? `Найдено ${pagination.total} аниме` : 'Загрузка...'}
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Фильтры</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Жанр
              </label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-purple dark:bg-gray-700 dark:text-white"
              >
                <option value="">Все жанры</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.name}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Год
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-purple dark:bg-gray-700 dark:text-white"
              >
                <option value="">Любой год</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Статус
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-purple dark:bg-gray-700 dark:text-white"
              >
                <option value="">Любой статус</option>
                <option value="FINISHED">Завершено</option>
                <option value="RELEASING">Выходит</option>
                <option value="NOT_YET_RELEASED">Анонс</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Сортировка
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-purple dark:bg-gray-700 dark:text-white"
              >
                <option value="popularity">По популярности</option>
                <option value="score">По рейтингу</option>
                <option value="year">По году</option>
                <option value="title">По названию</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Anime Grid */}
      <AnimeGrid anime={anime} loading={loading} error={error} />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Назад
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const pageNum = Math.max(1, pagination.page - 2) + i;
              if (pageNum > pagination.pages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    pageNum === pagination.page
                      ? 'bg-anime-purple text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
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
    </div>
  );
}
