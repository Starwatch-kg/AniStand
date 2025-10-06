
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Star, Heart, Plus, Calendar, Clock, TrendingUp, Image as ImageIcon, Film } from 'lucide-react';
import { useAnimeDetails } from '@/hooks/useAnime';
import { useLibrary } from '@/hooks/useLibrary';
import { useComments } from '@/hooks/useComments';
import { Layout } from '@/components/layout/Layout';
import { Button, Loading } from '@/components/ui';
import { formatDate, formatDuration, formatScore, sanitizeHTML } from '@/utils/formatters';
import { ANIME_STATUS, ANIME_FORMAT } from '@/utils/constants';
import { CommentSection } from '@/components/comments/CommentSection';

export const AnimeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { anime, episodes, loading } = useAnimeDetails(Number(id));
  const { isInFavorites, isInWatchlist, addAnime, removeAnime } = useLibrary();
  useComments(Number(id));
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [, setSelectedImage] = useState<string>('');

  if (loading || !anime) {
    return (
      <Layout>
        <Loading fullScreen />
      </Layout>
    );
  }

  const description = sanitizeHTML(anime.description || '');
  const isFavorite = isInFavorites(anime.id);
  const inWatchlist = isInWatchlist(anime.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeAnime(anime.id, 'favorites');
    } else {
      addAnime(anime.id, 'favorites');
    }
  };

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      removeAnime(anime.id, 'watchlist');
    } else {
      addAnime(anime.id, 'watchlist');
    }
  };

  const handleWatchEpisode = (episodeNumber: number) => {
    navigate(`/watch/${anime.id}/${episodeNumber}`);
  };

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <div className="relative h-[75vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={anime.bannerImage || anime.coverImage.extraLarge}
            alt={anime.title.romaji}
            className="w-full h-full object-cover scale-110 animate-slow-zoom"
          />
          {/* Multi-layer gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-dark/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 shadow-[inset_0_0_120px_RGBA(0,0,0,0.8)]" />
          {/* Animated particles overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/50 rounded-full animate-float"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-primary/40 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 -mt-48 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Enhanced Poster */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative group">
              {/* Glow effect behind poster */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <img
                  src={anime.coverImage.extraLarge}
                  alt={anime.title.romaji}
                  className="w-72 lg:w-80 rounded-2xl shadow-2xl border-2 border-white/10 transition-all duration-500 group-hover:scale-105 group-hover:border-primary/30"
                />
                
                {/* Overlay gradients */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-br from-primary to-primary-dark px-4 py-2 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform">
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Info */}
          <div className="flex-1 space-y-8">
            {/* Enhanced Title */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                  {anime.title.romaji}
                </span>
              </h1>
              {anime.title.native && (
                <p className="text-lg text-gray-400 font-light">{anime.title.native}</p>
              )}
              {anime.title.english && anime.title.english !== anime.title.romaji && (
                <p className="text-lg text-gray-500 italic">{anime.title.english}</p>
              )}
            </div>

            {/* Stats with Glass Morphism */}
            <div className="flex flex-wrap items-center gap-3">
              {anime.averageScore && (
                <div className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl">
                  <Star className="text-yellow-400 fill-yellow-400 drop-shadow-lg" size={22} />
                  <span className="text-white text-xl font-bold">
                    {formatScore(anime.averageScore)}
                  </span>
                  <span className="text-gray-300 text-sm">/10</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl">
                <TrendingUp className="text-primary drop-shadow-lg" size={22} />
                <span className="text-white font-semibold">{anime.popularity.toLocaleString()}</span>
              </div>
              <div className="px-5 py-3 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl shadow-xl">
                <span className="text-white font-bold">{ANIME_STATUS[anime.status]}</span>
              </div>
              {anime.format && (
                <div className="px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl">
                  <span className="text-white font-semibold">{ANIME_FORMAT[anime.format]}</span>
                </div>
              )}
            </div>

            {/* Actions with enhanced design */}
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleWatchEpisode(1)}
                className="flex items-center gap-3 shadow-2xl shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all px-8 py-4 text-lg"
              >
                <Play size={24} className="fill-current" />
                Смотреть сейчас
              </Button>
              <Button
                variant={isFavorite ? 'primary' : 'outline'}
                size="lg"
                onClick={handleToggleFavorite}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-xl hover:scale-105 transition-all px-6 py-4"
              >
                <Heart size={22} className={isFavorite ? 'fill-current' : ''} />
                {isFavorite ? 'В избранном' : 'В избранное'}
              </Button>
              <Button
                variant={inWatchlist ? 'primary' : 'outline'}
                size="lg"
                onClick={handleToggleWatchlist}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-xl hover:scale-105 transition-all px-6 py-4"
              >
                <Plus size={22} />
                {inWatchlist ? 'В списке' : 'Добавить'}
              </Button>
            </div>

            {/* Description with better typography */}
            <div className="bg-dark-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Film size={28} className="text-primary" />
                Описание
              </h3>
              <p className="text-gray-200 leading-relaxed text-lg">
                {showFullDescription ? description : description.substring(0, 400) + '...'}
              </p>
              {description.length > 400 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-4 text-primary hover:text-primary-light font-semibold transition-colors flex items-center gap-2 group"
                >
                  {showFullDescription ? 'Свернуть' : 'Читать далее'}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              )}
            </div>

            {/* Details Grid with icons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {anime.episodes && (
                <div className="bg-dark-card/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-all">
                  <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <Film size={16} className="text-primary" />
                    Эпизоды
                  </p>
                  <p className="text-white text-xl font-bold">{anime.episodes}</p>
                </div>
              )}
              {anime.duration && (
                <div className="bg-dark-card/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-all">
                  <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    Длительность
                  </p>
                  <p className="text-white text-xl font-bold">{formatDuration(anime.duration)}</p>
                </div>
              )}
              <div className="bg-dark-card/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-all">
                <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  Дата выхода
                </p>
                <p className="text-white text-xl font-bold">{formatDate(anime.startDate)}</p>
              </div>
              {anime.studios.nodes.length > 0 && (
                <div className="bg-dark-card/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-all">
                  <p className="text-gray-400 text-sm mb-2">Студия</p>
                  <p className="text-white text-lg font-bold">{anime.studios.nodes[0].name}</p>
                </div>
              )}
            </div>

            {/* Genres with enhanced design */}
            {anime.genres && anime.genres.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Жанры</h3>
                <div className="flex flex-wrap gap-3">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium hover:bg-primary hover:border-primary hover:scale-105 transition-all cursor-pointer shadow-lg"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Screenshot Gallery */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <ImageIcon size={32} className="text-primary" />
            Скриншоты и кадры
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[anime.bannerImage, anime.coverImage.extraLarge, anime.coverImage.large, anime.coverImage.medium].filter((img): img is string => Boolean(img)).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all"
              >
                <img
                  src={img}
                  alt={`Screenshot ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                    <ImageIcon size={32} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Episodes with enhanced design */}
        {episodes.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <Film size={32} className="text-primary" />
                Эпизоды
                <span className="text-gray-400 text-2xl">({episodes.length})</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {episodes.map((episode) => (
                <div
                  key={episode.id}
                  onClick={() => handleWatchEpisode(episode.number)}
                  className="bg-dark-card/50 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/50 transition-all group shadow-xl hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={episode.thumbnail}
                      alt={episode.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-primary hover:bg-primary-dark rounded-full p-5 shadow-2xl shadow-primary/50 transform group-hover:scale-110 transition-transform">
                        <Play className="text-white fill-current" size={32} />
                      </div>
                    </div>
                    
                    {/* Episode number badge */}
                    <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-white/10">
                      <span className="text-white font-bold text-sm">Эп. {episode.number}</span>
                    </div>
                    
                    {/* Duration badge */}
                    {episode.duration && (
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-xl">
                        <span className="text-white text-xs font-semibold">{episode.duration} мин</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {episode.title}
                    </h4>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      Посмотреть эпизод {episode.number}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="mt-12">
          <CommentSection animeId={anime.id} />
        </div>
      </div>
    </Layout>
  );
};
