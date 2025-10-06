export interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  description: string;
  coverImage: {
    large: string;
    medium: string;
    extraLarge: string;
  };
  bannerImage: string | null;
  averageScore: number;
  meanScore: number;
  popularity: number;
  favourites: number;
  genres: string[];
  status: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED';
  episodes: number | null;
  duration: number | null;
  season: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL' | null;
  seasonYear: number | null;
  format: 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC';
  studios: {
    nodes: Array<{
      id: number;
      name: string;
    }>;
  };
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  endDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  trailer: {
    id: string;
    site: string;
  } | null;
  tags: Array<{
    id: number;
    name: string;
    rank: number;
  }>;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  thumbnail: string;
  duration: number;
  aired: string;
  sources: VideoSource[];
}

export interface VideoSource {
  id: string;
  quality: string;
  url: string;
  type: 'hls' | 'mp4';
}

export interface Subtitle {
  id: string;
  language: string;
  label: string;
  url: string;
}

export interface AnimeFilters {
  search?: string;
  genres?: string[];
  season?: string;
  year?: number;
  status?: string;
  format?: string;
  sort?: 'POPULARITY_DESC' | 'SCORE_DESC' | 'TRENDING_DESC' | 'UPDATED_AT_DESC';
  page?: number;
  perPage?: number;
}

export interface AnimePage {
  pageInfo: {
    total: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
    perPage: number;
  };
  media: Anime[];
}
