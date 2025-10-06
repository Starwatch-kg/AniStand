import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLibrary } from '@/hooks/useLibrary';
import { Layout } from '@/components/layout/Layout';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { Loading } from '@/components/ui';
import { LIBRARY_TABS } from '@/utils/constants';
import { LibraryStatus, Anime } from '@/types';

export const Library: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { library, loading: libraryLoading } = useLibrary();
  const [activeTab, setActiveTab] = useState<LibraryStatus>(
    (searchParams.get('tab') as LibraryStatus) || 'favorites'
  );
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab') as LibraryStatus;
    if (tab && LIBRARY_TABS.find(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    loadAnimeForTab(activeTab);
  }, [activeTab, library]);

  const loadAnimeForTab = async (tab: LibraryStatus) => {
    const animeIds = library[tab];
    if (animeIds.length === 0) {
      setAnimeList([]);
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would fetch these anime details from the API
      // For now, we'll use a placeholder
      // const promises = animeIds.map(id => animeService.getAnimeById(id));
      // const results = await Promise.all(promises);
      // setAnimeList(results);
      setAnimeList([]);
    } catch (error) {
      console.error('Error loading anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: LibraryStatus) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const getTabCount = (tab: LibraryStatus) => {
    return library[tab]?.length || 0;
  };

  return (
    <Layout>
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Моя библиотека</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700">
          {LIBRARY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as LibraryStatus)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-sm">({getTabCount(tab.id as LibraryStatus)})</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading || libraryLoading ? (
          <div className="flex justify-center py-20">
            <Loading size="lg" />
          </div>
        ) : animeList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {animeList.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto bg-dark-card rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Список пуст
            </h3>
            <p className="text-gray-400">
              Добавьте аниме в эту категорию, чтобы увидеть их здесь
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};
