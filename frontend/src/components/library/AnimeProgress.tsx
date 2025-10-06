import React from 'react';
import { Play, Clock } from 'lucide-react';
import { Anime, WatchProgress } from '@/types';

interface AnimeProgressProps {
  anime: Anime;
  progress?: WatchProgress;
  onContinueWatching: () => void;
}

export const AnimeProgress: React.FC<AnimeProgressProps> = ({
  anime,
  progress,
  onContinueWatching,
}) => {
  const totalEpisodes = anime.episodes || 0;
  const watchedEpisodes = progress?.episodeNumber || 0;
  const progressPercentage = totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
      {/* Progress Info */}
      <div className="flex items-center justify-between mb-2 text-xs text-gray-300">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          Эпизод {watchedEpisodes} из {totalEpisodes}
        </span>
        <span>{progressPercentage.toFixed(0)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Continue Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onContinueWatching();
        }}
        className="w-full flex items-center justify-center gap-2 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium"
      >
        <Play size={16} />
        Продолжить просмотр
      </button>
    </div>
  );
};
