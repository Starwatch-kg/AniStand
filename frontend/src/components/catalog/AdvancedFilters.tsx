import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { GENRES, SEASONS } from '@/utils/constants';
import { Button } from '@/components/ui';

interface AdvancedFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    genres: true,
    year: true,
    season: true,
    rating: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleGenre = (genre: string) => {
    const newGenres = filters.genres?.includes(genre)
      ? filters.genres.filter((g: string) => g !== genre)
      : [...(filters.genres || []), genre];
    onFiltersChange({ ...filters, genres: newGenres });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const activeFiltersCount = [
    filters.genres?.length || 0,
    filters.season ? 1 : 0,
    filters.year ? 1 : 0,
    filters.status ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const FilterSection: React.FC<{
    title: string;
    section: keyof typeof expandedSections;
    count?: number;
    children: React.ReactNode;
  }> = ({ title, section, count, children }) => (
    <div className="border-b border-gray-700 last:border-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 hover:bg-dark-lighter transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{title}</span>
          {count !== undefined && count > 0 && (
            <span className="px-2 py-0.5 bg-primary rounded-full text-white text-xs">
              {count}
            </span>
          )}
        </div>
        {expandedSections[section] ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="px-4 pb-4 animate-slide-up">{children}</div>
      )}
    </div>
  );

  return (
    <div className="bg-dark-card rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-white">Фильтры</h3>
          {activeFiltersCount > 0 && (
            <span className="px-3 py-1 bg-primary rounded-full text-white text-sm font-medium">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
            >
              <RotateCcw size={18} />
              <span className="text-sm">Сбросить</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-lighter rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className="max-h-[60vh] overflow-y-auto">
        {/* Genres */}
        <FilterSection
          title="Жанры"
          section="genres"
          count={filters.genres?.length}
        >
          <div className="grid grid-cols-2 gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${filters.genres?.includes(genre)
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-dark-lighter text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                {genre}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Season */}
        <FilterSection
          title="Сезон"
          section="season"
          count={filters.season ? 1 : 0}
        >
          <div className="grid grid-cols-2 gap-2">
            {SEASONS.map((season) => (
              <button
                key={season}
                onClick={() => onFiltersChange({ ...filters, season: filters.season === season ? '' : season })}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${filters.season === season
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-dark-lighter text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                {season}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Year */}
        <FilterSection
          title="Год"
          section="year"
          count={filters.year ? 1 : 0}
        >
          <select
            value={filters.year || ''}
            onChange={(e) => onFiltersChange({ ...filters, year: e.target.value })}
            className="w-full px-4 py-3 bg-dark-lighter border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Все годы</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </FilterSection>

        {/* Rating Range */}
        <FilterSection title="Рейтинг" section="rating">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">От {filters.minRating || 0}</span>
              <span className="text-gray-400">До {filters.maxRating || 10}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.minRating || 0}
              onChange={(e) => onFiltersChange({ ...filters, minRating: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
        </FilterSection>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700 bg-dark-lighter">
        <div className="flex gap-3">
          <Button
            onClick={onApply}
            variant="primary"
            className="flex-1"
          >
            Применить фильтры
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1"
          >
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
};
