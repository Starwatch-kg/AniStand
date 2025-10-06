import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Settings, Volume2, VolumeX, Maximize, Minimize, SkipForward, SkipBack, Play, Pause, Monitor } from 'lucide-react';
import { VideoSource, Subtitle } from '@/types';

type PlayerType = 'default' | 'kodik' | 'anilibria' | 'sibnet';

interface PlayerOption {
  id: PlayerType;
  name: string;
  embedUrl?: string;
}

interface VideoPlayerProps {
  sources: VideoSource[];
  subtitles?: Subtitle[];
  poster?: string;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
  startTime?: number;
  autoPlay?: boolean;
  animeId?: number;
  episodeNumber?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  sources,
  subtitles = [],
  poster,
  onTimeUpdate,
  onEnded,
  startTime = 0,
  autoPlay = false,
  animeId,
  episodeNumber,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>('default');
  const [currentQuality, setCurrentQuality] = useState(sources[0]?.quality || '1080p');
  const [showSettings, setShowSettings] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('off');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Available players
  const players: PlayerOption[] = [
    { id: 'default', name: 'Основной плеер' },
    { id: 'kodik', name: 'Kodik', embedUrl: animeId ? `https://kodik.info/serial/${animeId}/${episodeNumber || 1}/720p` : undefined },
    { id: 'anilibria', name: 'AniLibria', embedUrl: animeId ? `https://anilibria.tv/embed/${animeId}?episode=${episodeNumber || 1}` : undefined },
    { id: 'sibnet', name: 'Sibnet', embedUrl: animeId ? `https://video.sibnet.ru/shell.php?videoid=${animeId}${episodeNumber || 1}` : undefined },
  ];

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: false, // We'll use custom controls
      autoplay: autoPlay,
      preload: 'auto',
      fluid: true,
      poster: poster,
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
    });

    playerRef.current = player;

    // Set initial source
    if (sources.length > 0) {
      player.src({
        src: sources[0].url,
        type: sources[0].type === 'hls' ? 'application/x-mpegURL' : 'video/mp4',
      });
    }

    // Add subtitles
    subtitles.forEach((subtitle) => {
      player.addRemoteTextTrack({
        kind: 'subtitles',
        label: subtitle.label,
        srclang: subtitle.language,
        src: subtitle.url,
      }, false);
    });

    // Set start time
    if (startTime && startTime > 0) {
      player.currentTime(startTime);
    }

    // Event listeners
    player.on('timeupdate', () => {
      const currentTime = player.currentTime();
      if (typeof currentTime === 'number') {
        setCurrentTime(currentTime);
        if (onTimeUpdate) {
          onTimeUpdate(currentTime);
        }
      }
    });

    player.on('durationchange', () => {
      const duration = player.duration();
      if (typeof duration === 'number') {
        setDuration(duration);
      }
    });

    player.on('play', () => setIsPlaying(true));
    player.on('pause', () => setIsPlaying(false));
    player.on('volumechange', () => {
      setVolume(player.volume() || 0);
      setIsMuted(player.muted() || false);
    });

    player.on('ended', () => {
      if (onEnded) {
        onEnded();
      }
    });

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  // Quality change
  useEffect(() => {
    if (playerRef.current && sources.length > 0) {
      const currentTime = playerRef.current.currentTime();
      const isPaused = playerRef.current.paused();
      
      const selectedSource = sources.find(s => s.quality === currentQuality) || sources[0];
      
      playerRef.current.src({
        src: selectedSource.url,
        type: selectedSource.type === 'hls' ? 'application/x-mpegURL' : 'video/mp4',
      });

      playerRef.current.currentTime(currentTime);
      
      if (!isPaused) {
        playerRef.current.play();
      }
    }
  }, [currentQuality]);

  // Subtitle change
  useEffect(() => {
    if (playerRef.current) {
      const tracks = playerRef.current.textTracks();
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = tracks[i].language === currentSubtitle ? 'showing' : 'hidden';
      }
    }
  }, [currentSubtitle]);

  // Playback rate change
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate(playbackRate);
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.volume(newVolume);
      if (newVolume > 0 && isMuted) {
        playerRef.current.muted(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.currentTime(newTime);
    }
  };

  const skip = (seconds: number) => {
    if (playerRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      playerRef.current.currentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Player Selector */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        {players.filter(p => p.id === 'default' || p.embedUrl).map((player) => (
          <button
            key={player.id}
            onClick={() => setCurrentPlayer(player.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              currentPlayer === player.id
                ? 'bg-primary text-white shadow-lg shadow-primary/50'
                : 'bg-black/60 backdrop-blur-md text-gray-300 hover:bg-black/80 hover:text-white border border-white/10'
            }`}
          >
            <Monitor size={16} />
            {player.name}
          </button>
        ))}
      </div>

      {/* Video Element or Iframe */}
      {currentPlayer === 'default' ? (
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js w-full"
            onClick={togglePlay}
          />
        </div>
      ) : (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={players.find(p => p.id === currentPlayer)?.embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            frameBorder="0"
          />
        </div>
      )}

      {/* Custom Controls Overlay - Only for default player */}
      {currentPlayer === 'default' && (
      <div
        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="px-4 mb-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary hover:h-2 transition-all"
            style={{
              background: `linear-gradient(to right, #E50914 0%, #E50914 ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause size={24} className="text-white" />
              ) : (
                <Play size={24} className="text-white" />
              )}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => skip(-10)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Назад 10 сек"
            >
              <SkipBack size={20} className="text-white" />
            </button>
            <button
              onClick={() => skip(10)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Вперед 10 сек"
            >
              <SkipForward size={20} className="text-white" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={20} className="text-white" />
                ) : (
                  <Volume2 size={20} className="text-white" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Time Display */}
            <span className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Settings size={20} className="text-white" />
              </button>

              {/* Settings Menu */}
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-dark-card rounded-lg shadow-xl border border-gray-700 overflow-hidden animate-scale-in">
                  {/* Quality */}
                  <div className="p-3 border-b border-gray-700">
                    <label className="block text-white text-sm font-medium mb-2">
                      Качество
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {sources.map((source) => (
                        <button
                          key={source.id}
                          onClick={() => setCurrentQuality(source.quality)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentQuality === source.quality
                              ? 'bg-primary text-white'
                              : 'bg-dark-lighter text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {source.quality}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subtitles */}
                  {subtitles.length > 0 && (
                    <div className="p-3 border-b border-gray-700">
                      <label className="block text-white text-sm font-medium mb-2">
                        Субтитры
                      </label>
                      <select
                        value={currentSubtitle}
                        onChange={(e) => setCurrentSubtitle(e.target.value)}
                        className="w-full px-3 py-2 bg-dark-lighter border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="off">Выключены</option>
                        {subtitles.map((subtitle) => (
                          <option key={subtitle.id} value={subtitle.language}>
                            {subtitle.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Playback Speed */}
                  <div className="p-3">
                    <label className="block text-white text-sm font-medium mb-2">
                      Скорость
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setPlaybackRate(rate)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            playbackRate === rate
                              ? 'bg-primary text-white'
                              : 'bg-dark-lighter text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isFullscreen ? (
                <Minimize size={20} className="text-white" />
              ) : (
                <Maximize size={20} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Loading Indicator */}
      {currentPlayer === 'default' && !isPlaying && currentTime === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
