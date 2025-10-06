import React from 'react';
import { Star, Eye, Clock, CheckCircle, Pause, X } from 'lucide-react';
import { UserLibrary } from '@/types';

interface LibraryStatsProps {
  library: UserLibrary;
}

export const LibraryStats: React.FC<LibraryStatsProps> = ({ library }) => {
  const stats = [
    {
      label: 'Избранное',
      count: library.favorites?.length || 0,
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20',
    },
    {
      label: 'Смотрю',
      count: library.watching?.length || 0,
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
    },
    {
      label: 'Просмотрено',
      count: library.completed?.length || 0,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
    },
    {
      label: 'В планах',
      count: library.watchlist?.length || 0,
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
    },
    {
      label: 'Отложено',
      count: library.onHold?.length || 0,
      icon: Pause,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20',
    },
    {
      label: 'Брошено',
      count: library.dropped?.length || 0,
      icon: X,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
    },
  ];

  const totalAnime = stats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <div className="mb-8">
      {/* Total Stats */}
      <div className="bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-lg p-6 mb-6 border border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">{totalAnime}</h3>
            <p className="text-gray-400">Всего аниме в библиотеке</p>
          </div>
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Star size={32} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const percentage = totalAnime > 0 ? (stat.count / totalAnime) * 100 : 0;

          return (
            <div
              key={stat.label}
              className={`
                ${stat.bgColor} ${stat.borderColor}
                border rounded-lg p-4 transition-all hover:scale-105 cursor-pointer
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={24} className={stat.color} />
                <span className="text-2xl font-bold text-white">{stat.count}</span>
              </div>
              <p className="text-gray-300 text-sm font-medium mb-2">{stat.label}</p>
              
              {/* Progress Bar */}
              <div className="h-1.5 bg-dark-lighter rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.color.replace('text-', 'bg-')} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">{percentage.toFixed(0)}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
