import { anilistClient, jikanClient } from './api';
import { Anime, AnimeFilters, AnimePage, Episode } from '@/types';

const ANIME_FIELDS = `
  id
  title {
    romaji
    english
    native
  }
  description
  coverImage {
    large
    medium
    extraLarge
  }
  bannerImage
  averageScore
  meanScore
  popularity
  favourites
  genres
  status
  episodes
  duration
  season
  seasonYear
  format
  studios {
    nodes {
      id
      name
    }
  }
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  trailer {
    id
    site
  }
  tags {
    id
    name
    rank
  }
`;

export const animeService = {
  async getTrending(): Promise<Anime[]> {
    const query = `
      query {
        Page(page: 1, perPage: 10) {
          media(sort: TRENDING_DESC, type: ANIME) {
            ${ANIME_FIELDS}
          }
        }
      }
    `;

    const response = await anilistClient.post('', { query });
    return response.data.data.Page.media;
  },

  async getPopular(): Promise<Anime[]> {
    const query = `
      query {
        Page(page: 1, perPage: 20) {
          media(sort: POPULARITY_DESC, type: ANIME) {
            ${ANIME_FIELDS}
          }
        }
      }
    `;

    const response = await anilistClient.post('', { query });
    return response.data.data.Page.media;
  },

  async getCurrentSeason(): Promise<Anime[]> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    let season: string;
    if (month >= 1 && month <= 3) season = 'WINTER';
    else if (month >= 4 && month <= 6) season = 'SPRING';
    else if (month >= 7 && month <= 9) season = 'SUMMER';
    else season = 'FALL';

    const query = `
      query {
        Page(page: 1, perPage: 20) {
          media(season: ${season}, seasonYear: ${year}, type: ANIME, sort: POPULARITY_DESC) {
            ${ANIME_FIELDS}
          }
        }
      }
    `;

    const response = await anilistClient.post('', { query });
    return response.data.data.Page.media;
  },

  async searchAnime(filters: AnimeFilters): Promise<AnimePage> {
    const {
      search,
      genres,
      season,
      year,
      status,
      format,
      sort = 'POPULARITY_DESC',
      page = 1,
      perPage = 20,
    } = filters;

    let filterString = 'type: ANIME';
    if (search) filterString += `, search: "${search}"`;
    if (genres && genres.length > 0) filterString += `, genre_in: [${genres.map(g => `"${g}"`).join(', ')}]`;
    if (season) filterString += `, season: ${season}`;
    if (year) filterString += `, seasonYear: ${year}`;
    if (status) filterString += `, status: ${status}`;
    if (format) filterString += `, format: ${format}`;

    const query = `
      query {
        Page(page: ${page}, perPage: ${perPage}) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media(${filterString}, sort: ${sort}) {
            ${ANIME_FIELDS}
          }
        }
      }
    `;

    const response = await anilistClient.post('', { query });
    return response.data.data.Page;
  },

  async getAnimeById(id: number): Promise<Anime> {
    const query = `
      query {
        Media(id: ${id}, type: ANIME) {
          ${ANIME_FIELDS}
        }
      }
    `;

    const response = await anilistClient.post('', { query });
    return response.data.data.Media;
  },

  async getEpisodes(animeId: number): Promise<Episode[]> {
    const anime = await this.getAnimeById(animeId);
    const episodeCount = anime.episodes || 12;
    
    // Collect images from multiple sources
    let availableImages: string[] = [];
    
    try {
      // 1. Get ALL images from AniList (повторяем для разнообразия)
      if (anime.bannerImage) {
        availableImages.push(anime.bannerImage);
        availableImages.push(anime.bannerImage); // дублируем
      }
      if (anime.coverImage.extraLarge) availableImages.push(anime.coverImage.extraLarge);
      if (anime.coverImage.large) availableImages.push(anime.coverImage.large);
      if (anime.coverImage.medium) availableImages.push(anime.coverImage.medium);
      if (anime.coverImage.extraLarge) availableImages.push(anime.coverImage.extraLarge); // дублируем
      
      // 2. Try to get additional images from Jikan (MyAnimeList)
      try {
        // Search for anime on MAL by title
        const searchResponse = await jikanClient.get(`/anime?q=${encodeURIComponent(anime.title.romaji)}&limit=1`);
        if (searchResponse.data.data && searchResponse.data.data.length > 0) {
          const malAnime = searchResponse.data.data[0];
          const malId = malAnime.mal_id;
          
          // Add MAL main images
          if (malAnime.images?.jpg?.large_image_url) availableImages.push(malAnime.images.jpg.large_image_url);
          if (malAnime.images?.jpg?.image_url) availableImages.push(malAnime.images.jpg.image_url);
          if (malAnime.images?.webp?.large_image_url) availableImages.push(malAnime.images.webp.large_image_url);
          
          // Get pictures from MAL (обычно 10-20 изображений)
          const picturesResponse = await jikanClient.get(`/anime/${malId}/pictures`);
          if (picturesResponse.data.data) {
            picturesResponse.data.data.forEach((pic: any) => {
              if (pic.jpg?.large_image_url) availableImages.push(pic.jpg.large_image_url);
              if (pic.jpg?.image_url) availableImages.push(pic.jpg.image_url);
              if (pic.webp?.large_image_url) availableImages.push(pic.webp.large_image_url);
            });
          }
          
          // Get characters images (топ 10 персонажей)
          const charactersResponse = await jikanClient.get(`/anime/${malId}/characters`);
          if (charactersResponse.data.data) {
            charactersResponse.data.data.slice(0, 10).forEach((char: any) => {
              if (char.character?.images?.jpg?.large_image_url) {
                availableImages.push(char.character.images.jpg.large_image_url);
              }
              if (char.character?.images?.jpg?.image_url) {
                availableImages.push(char.character.images.jpg.image_url);
              }
              if (char.character?.images?.webp?.image_url) {
                availableImages.push(char.character.images.webp.image_url);
              }
            });
          }
          
          // Get staff images
          const staffResponse = await jikanClient.get(`/anime/${malId}/staff`);
          if (staffResponse.data.data) {
            staffResponse.data.data.slice(0, 5).forEach((staff: any) => {
              if (staff.person?.images?.jpg?.image_url) {
                availableImages.push(staff.person.images.jpg.image_url);
              }
            });
          }
        }
      } catch (jikanError) {
        console.warn('Jikan API error, using AniList images only:', jikanError);
      }
      
      // 3. Generate МНОГО уникальных изображений для каждого эпизода
      const baseImages = [anime.bannerImage, anime.coverImage.extraLarge, anime.coverImage.large].filter(Boolean);
      
      // Создаем уникальные вариации для каждого эпизода
      for (let i = 0; i < episodeCount; i++) {
        // Используем базовые изображения с параметрами
        baseImages.forEach(img => {
          if (img) {
            availableImages.push(`${img}?ep=${i}`); // добавляем параметр для уникальности
          }
        });
        
        // Picsum с разными seed для каждого эпизода
        availableImages.push(`https://picsum.photos/seed/${animeId}-${i}-1/800/450`);
        availableImages.push(`https://picsum.photos/seed/${animeId}-${i}-2/800/450`);
        
        // Unsplash с разными запросами
        const genres = anime.genres?.[i % (anime.genres?.length || 1)] || 'anime';
        availableImages.push(`https://source.unsplash.com/800x450/?${genres},${i}`);
        availableImages.push(`https://source.unsplash.com/800x450/?anime,episode${i}`);
      }
      
      // 4. Добавляем еще больше разнообразных источников
      const additionalSources = [
        `https://loremflickr.com/800/450/anime,${encodeURIComponent(anime.title.romaji)}`,
        `https://loremflickr.com/800/450/animation,japanese`,
        `https://loremflickr.com/800/450/manga,art`,
      ];
      availableImages.push(...additionalSources);
      
      // 5. Placeholder.com с разными цветами
      const colors = ['FF6B6B', 'E50914', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE'];
      colors.forEach((color, idx) => {
        availableImages.push(`https://via.placeholder.com/800x450/${color}/FFFFFF?text=Episode+${idx + 1}`);
      });
      
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    
    // Filter out null/undefined and ensure we have at least one image
    availableImages = availableImages.filter(Boolean);
    if (availableImages.length === 0) {
      availableImages = [anime.coverImage.large];
    }
    
    return Array.from({ length: episodeCount }, (_, i) => {
      // Use different image for each episode
      const imageIndex = i % availableImages.length;
      const thumbnail = availableImages[imageIndex];
      
      return {
        id: `${animeId}-${i + 1}`,
        number: i + 1,
        title: `Эпизод ${i + 1}`,
        thumbnail: thumbnail,
        duration: anime.duration || 24,
        aired: new Date(Date.now() - (episodeCount - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        sources: [
          {
            id: `source-${i + 1}-1`,
            quality: '1080p',
            url: `https://example.com/video/${animeId}/${i + 1}/1080p.m3u8`,
            type: 'hls' as const,
          },
          {
            id: `source-${i + 1}-2`,
            quality: '720p',
            url: `https://example.com/video/${animeId}/${i + 1}/720p.m3u8`,
            type: 'hls' as const,
          },
          {
            id: `source-${i + 1}-3`,
            quality: '480p',
            url: `https://example.com/video/${animeId}/${i + 1}/480p.m3u8`,
            type: 'hls' as const,
          },
        ],
      };
    });
  },
};
