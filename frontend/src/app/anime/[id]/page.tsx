'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Calendar, Play, Clock, Heart, Share2 } from 'lucide-react';
import { animeApi, episodeApi, Anime, Episode } from '@/lib/api';

export default function AnimeDetailPage() {
  const params = useParams();
  const animeId = parseInt(params.id as string);
  
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    if (animeId) {
      loadAnimeData();
    }
  }, [animeId]);

  const loadAnimeData = async () => {
    setLoading(true);
    try {
      // Загружаем детали аниме
      const animeData = await animeApi.getDetail(animeId);
      setAnime(animeData);

      // Загружаем эпизоды
      const episodesData = await episodeApi.getByAnime(animeId);
      setEpisodes(episodesData.data);
      
      if (episodesData.data.length > 0) {
        setSelectedEpisode(episodesData.data[0]);
      }

      setError('');
    } catch (err) {
      console.error('Error loading anime data:', err);
      setError('Не удалось загрузить информацию об аниме');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'FINISHED':
        return 'bg-green-100 text-green-800';
      case 'RELEASING':
        return 'bg-blue-100 text-blue-800';
      case 'NOT_YET_RELEASED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'FINISHED':
        return 'Завершено';
      case 'RELEASING':
        return 'Выходит';
      case 'NOT_YET_RELEASED':
        return 'Анонс';
      default:
        return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anime-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ошибка</h1>
          <p className="text-gray-600">{error || 'Аниме не найдено'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Banner Section */}
      {anime.banner_image && (
        <div 
          className="h-64 md:h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${anime.banner_image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Poster and Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {/* Poster */}
              <div className="aspect-[3/4] relative">
                {anime.cover_image ? (
                  <Image
                    src={anime.cover_image}
                    alt={anime.title_romaji}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-anime-purple to-anime-pink flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">
                      {anime.title_romaji.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Status */}
                  {anime.status && (
                    <div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(anime.status)}`}>
                        {getStatusText(anime.status)}
                      </span>
                    </div>
                  )}

                  {/* Score */}
                  {anime.average_score && (
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold">{(anime.average_score / 10).toFixed(1)}</span>
                      <span className="text-gray-500">/ 10</span>
                    </div>
                  )}

                  {/* Episodes */}
                  {anime.episodes && (
                    <div className="flex items-center space-x-2">
                      <Play className="h-5 w-5 text-gray-500" />
                      <span>{anime.episodes} эпизодов</span>
                    </div>
                  )}

                  {/* Duration */}
                  {anime.duration && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span>{anime.duration} мин/эп</span>
                    </div>
                  )}

                  {/* Year */}
                  {anime.season_year && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span>{anime.season_year}</span>
                      {anime.season && <span>• {anime.season}</span>}
                    </div>
                  )}

                  {/* Studios */}
                  {anime.studios && anime.studios.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Студия</h4>
                      <div className="flex flex-wrap gap-2">
                        {anime.studios.map((studio) => (
                          <span
                            key={studio.id}
                            className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                          >
                            {studio.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Genres */}
                  {anime.genres && anime.genres.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Жанры</h4>
                      <div className="flex flex-wrap gap-2">
                        {anime.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-2 py-1 text-sm bg-anime-purple bg-opacity-10 text-anime-purple rounded"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button className="w-full anime-button flex items-center justify-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Добавить в избранное</span>
                  </button>
                  <button className="w-full border border-anime-purple text-anime-purple px-4 py-2 rounded-lg hover:bg-anime-purple hover:text-white transition-colors flex items-center justify-center space-x-2">
                    <Share2 className="h-5 w-5" />
                    <span>Поделиться</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details and Episodes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {anime.title_english || anime.title_romaji}
              </h1>
              {anime.title_romaji !== anime.title_english && (
                <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  {anime.title_romaji}
                </h2>
              )}
              {anime.title_native && (
                <h3 className="text-lg text-gray-500 dark:text-gray-500 mb-6">
                  {anime.title_native}
                </h3>
              )}

              {anime.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Описание</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {anime.description}
                  </p>
                </div>
              )}
            </div>

            {/* Episodes */}
            {episodes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Эпизоды ({episodes.length})
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEpisode?.id === episode.id
                          ? 'border-anime-purple bg-anime-purple bg-opacity-10'
                          : 'border-gray-200 dark:border-gray-600 hover:border-anime-purple'
                      }`}
                      onClick={() => setSelectedEpisode(episode)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-anime-purple text-white rounded-lg flex items-center justify-center font-semibold">
                          {episode.episode_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {episode.title || `Эпизод ${episode.episode_number}`}
                          </h4>
                          {episode.duration && (
                            <p className="text-sm text-gray-500">
                              {Math.floor(episode.duration / 60)} мин
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedEpisode && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedEpisode.title || `Эпизод ${selectedEpisode.episode_number}`}
                    </h4>
                    {selectedEpisode.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {selectedEpisode.description}
                      </p>
                    )}
                    <button className="anime-button">
                      <Play className="h-5 w-5 mr-2" />
                      Смотреть эпизод
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
