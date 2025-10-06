import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, List, Play } from 'lucide-react';
import { useAnimeDetails } from '@/hooks/useAnime';
import { useLibrary } from '@/hooks/useLibrary';
import { Layout } from '@/components/layout/Layout';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { Button, Loading } from '@/components/ui';

export const Watch: React.FC = () => {
  const { id, episode } = useParams<{ id: string; episode: string }>();
  const navigate = useNavigate();
  const { anime, episodes, loading } = useAnimeDetails(Number(id));
  const { updateProgress } = useLibrary();
  const [showEpisodeList, setShowEpisodeList] = useState(false);

  const currentEpisodeNumber = Number(episode);
  const currentEpisode = episodes.find(ep => ep.number === currentEpisodeNumber);

  useEffect(() => {
    // Mark as watching when component mounts
    if (anime) {
      // This would typically call your backend to update the library status
    }
  }, [anime]);

  const handleTimeUpdate = (time: number) => {
    if (anime && currentEpisode) {
      updateProgress({
        animeId: anime.id,
        episodeNumber: currentEpisodeNumber,
        progress: time,
        lastWatched: new Date().toISOString(),
      });
    }
  };

  const handleEpisodeEnd = () => {
    // Auto-play next episode
    if (currentEpisodeNumber < episodes.length) {
      navigate(`/watch/${id}/${currentEpisodeNumber + 1}`);
    }
  };

  const goToPreviousEpisode = () => {
    if (currentEpisodeNumber > 1) {
      navigate(`/watch/${id}/${currentEpisodeNumber - 1}`);
    }
  };

  const goToNextEpisode = () => {
    if (currentEpisodeNumber < episodes.length) {
      navigate(`/watch/${id}/${currentEpisodeNumber + 1}`);
    }
  };

  const selectEpisode = (episodeNumber: number) => {
    navigate(`/watch/${id}/${episodeNumber}`);
    setShowEpisodeList(false);
  };

  if (loading || !anime || !currentEpisode) {
    return (
      <Layout>
        <Loading fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/anime/${id}`)}
          className="mb-6 hover:scale-105 transition-transform"
        >
          ← Назад к деталям
        </Button>

        {/* Video Player with enhanced design */}
        <div className="bg-black rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10">
          <VideoPlayer
            sources={currentEpisode.sources}
            poster={currentEpisode.thumbnail}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEpisodeEnd}
            animeId={anime.id}
            episodeNumber={currentEpisodeNumber}
          />
        </div>

        {/* Episode Info with glass morphism */}
        <div className="bg-dark-card/50 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/10 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3 text-shadow-lg">
                {anime.title.romaji}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl text-primary font-bold">
                  Эпизод {currentEpisodeNumber}
                </span>
                <span className="text-gray-400 text-lg">{currentEpisode.title}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <img
                src={anime.coverImage.large}
                alt={anime.title.romaji}
                className="w-24 h-36 rounded-xl shadow-xl border-2 border-white/10"
              />
            </div>
          </div>
        </div>

        {/* Episode Navigation with enhanced design */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <Button
            variant="secondary"
            onClick={goToPreviousEpisode}
            disabled={currentEpisodeNumber === 1}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-xl hover:scale-105 transition-all px-6 py-4 w-full md:w-auto"
          >
            <ChevronLeft size={24} />
            Предыдущий
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowEpisodeList(!showEpisodeList)}
            className="flex items-center gap-3 bg-primary/20 backdrop-blur-md border border-primary/30 hover:bg-primary/30 shadow-xl hover:scale-105 transition-all px-8 py-4 w-full md:w-auto"
          >
            <List size={24} />
            Все эпизоды ({episodes.length})
          </Button>

          <Button
            variant="secondary"
            onClick={goToNextEpisode}
            disabled={currentEpisodeNumber === episodes.length}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-xl hover:scale-105 transition-all px-6 py-4 w-full md:w-auto"
          >
            Следующий
            <ChevronRight size={24} />
          </Button>
        </div>

        {/* Episode List with thumbnails */}
        {showEpisodeList && (
          <div className="bg-dark-card/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl animate-slide-down">
            <h3 className="text-2xl font-bold text-white mb-6">Все эпизоды</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {episodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => selectEpisode(ep.number)}
                  className={`group cursor-pointer rounded-xl overflow-hidden transition-all hover:scale-105 ${
                    ep.number === currentEpisodeNumber
                      ? 'ring-2 ring-primary shadow-xl shadow-primary/50'
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="relative aspect-video">
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 ${
                      ep.number === currentEpisodeNumber
                        ? 'bg-primary/30'
                        : 'bg-black/50 group-hover:bg-black/30'
                    } transition-colors`} />
                    <div className="absolute top-2 left-2 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg">
                      <span className="text-white text-xs font-bold">Эп. {ep.number}</span>
                    </div>
                    {ep.number === currentEpisodeNumber && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary rounded-full p-3">
                          <Play className="text-white fill-current" size={24} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 ${
                    ep.number === currentEpisodeNumber
                      ? 'bg-primary/20'
                      : 'bg-dark-lighter'
                  }`}>
                    <p className="text-white text-sm font-semibold line-clamp-2">{ep.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-white mb-4">Рекомендации</h3>
          <p className="text-gray-400">Скоро здесь появятся рекомендации...</p>
        </div>
      </div>
    </Layout>
  );
};
