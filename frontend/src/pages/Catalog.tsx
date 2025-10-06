import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { useAnime } from '@/hooks';
import { Layout } from '@/components/layout/Layout';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { Button, Input, Loading } from '@/components/ui';
import { GENRES, SEASONS, SORT_OPTIONS } from '@/utils/constants';

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults, loading, search } = useAnime();
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    genres: [] as string[],
    season: '',
    year: '',
    status: '',
    format: '',
    sort: 'POPULARITY_DESC',
  });

  useEffect(() => {
    const initialSearch = searchParams.get('search');
    if (initialSearch) {
      setFilters(prev => ({ ...prev, search: initialSearch }));
      search({ search: initialSearch });
    } else {
      search({});
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params: any = {};
    if (filters.search) params.search = filters.search;
    if (filters.genres.length > 0) params.genres = filters.genres;
    if (filters.season) params.season = filters.season;
    if (filters.year) params.year = parseInt(filters.year);
    if (filters.status) params.status = filters.status;
    if (filters.format) params.format = filters.format;
    params.sort = filters.sort;

    search(params);
    
    // Update URL
    const newSearchParams = new URLSearchParams();
    if (filters.search) newSearchParams.set('search', filters.search);
    setSearchParams(newSearchParams);
  };

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      genres: [],
      season: '',
      year: '',
      status: '',
      format: '',
      sort: 'POPULARITY_DESC',
    });
    setSearchParams({});
    search({});
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Layout>
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Поиск аниме..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                icon={<Search size={20} />}
              />
            </div>
            <Button type="submit" variant="primary">
              Найти
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={20} />
              Фильтры
            </Button>
          </form>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-dark-card rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Фильтры</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Genres */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Жанры
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        filters.genres.includes(genre)
                          ? 'bg-primary text-white'
                          : 'bg-dark-lighter text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season & Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Сезон
                  </label>
                  <select
                    value={filters.season}
                    onChange={(e) => setFilters(prev => ({ ...prev, season: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-lighter border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  >
                    <option value="">Все сезоны</option>
                    {SEASONS.map((season) => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Год
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-lighter border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  >
                    <option value="">Все годы</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Сортировка
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                  className="w-full px-4 py-3 bg-dark-lighter border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      По {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button onClick={applyFilters} variant="primary" className="flex-1">
                  Применить фильтры
                </Button>
                <Button onClick={clearFilters} variant="outline" className="flex-1">
                  Сбросить
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loading size="lg" />
          </div>
        ) : searchResults && searchResults.media.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                Найдено {searchResults.pageInfo.total} результатов
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.media.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
            
            {/* Pagination */}
            {searchResults.pageInfo.hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => {
                    search({
                      ...filters,
                      year: filters.year ? Number(filters.year) : undefined,
                      page: searchResults.pageInfo.currentPage || 1,
                    });
                  }}
                  variant="secondary"
                >
                  Загрузить еще
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Ничего не найдено</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
