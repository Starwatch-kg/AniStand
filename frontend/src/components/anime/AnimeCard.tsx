'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Play } from 'lucide-react';
import { Anime } from '@/lib/api';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
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

  return (
    <div className="anime-card group overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {anime.cover_image ? (
          <Image
            src={anime.cover_image}
            alt={anime.title_romaji}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-anime-purple to-anime-pink flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {anime.title_romaji.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <Link href={`/anime/${anime.id}`}>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100">
              <Play className="h-6 w-6" />
            </button>
          </Link>
        </div>

        {/* Status Badge */}
        {anime.status && (
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(anime.status)}`}>
              {getStatusText(anime.status)}
            </span>
          </div>
        )}

        {/* Score Badge */}
        {anime.average_score && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{(anime.average_score / 10).toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/anime/${anime.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-anime-purple transition-colors">
            {anime.title_english || anime.title_romaji}
          </h3>
        </Link>

        {/* Genres */}
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {anime.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {genre.name}
              </span>
            ))}
            {anime.genres.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                +{anime.genres.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{anime.season_year || 'N/A'}</span>
          </div>
          {anime.episodes && (
            <span>{anime.episodes} эп.</span>
          )}
        </div>

        {/* Studios */}
        {anime.studios && anime.studios.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {anime.studios[0].name}
          </div>
        )}
      </div>
    </div>
  );
}
