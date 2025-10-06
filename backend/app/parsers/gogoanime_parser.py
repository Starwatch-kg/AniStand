from typing import List, Dict, Optional
import re
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from loguru import logger

from .base_parser import BaseParser


class GogoAnimeParser(BaseParser):
    """Парсер для GogoAnime (источник видео)"""
    
    BASE_URL = "https://gogoanime.cl"
    AJAX_URL = "https://ajax.gogo-load.com/ajax"
    
    async def get_anime_metadata(self, anime_id: str) -> Optional[Dict]:
        """Получить метаданные аниме из GogoAnime"""
        
        url = f"{self.BASE_URL}/category/{anime_id}"
        
        try:
            async with self.session.get(url) as response:
                if response.status != 200:
                    return None
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                return self._parse_anime_page(soup)
                
        except Exception as e:
            logger.error(f"Error fetching anime from GogoAnime: {str(e)}")
            return None
    
    async def search_anime(self, query: str, limit: int = 10) -> List[Dict]:
        """Поиск аниме в GogoAnime"""
        
        url = f"{self.BASE_URL}/search.html"
        params = {"keyword": query}
        
        try:
            async with self.session.get(url, params=params) as response:
                if response.status != 200:
                    return []
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                results = []
                items = soup.find_all('li', limit=limit)
                
                for item in items:
                    anime_data = self._parse_search_item(item)
                    if anime_data:
                        results.append(anime_data)
                
                return results
                
        except Exception as e:
            logger.error(f"Error searching anime in GogoAnime: {str(e)}")
            return []
    
    async def get_episodes(self, anime_id: str) -> List[Dict]:
        """Получить список эпизодов из GogoAnime"""
        
        # Сначала получаем информацию об аниме для определения количества эпизодов
        anime_data = await self.get_anime_metadata(anime_id)
        if not anime_data:
            return []
        
        episodes = []
        
        # GogoAnime использует пагинацию для эпизодов
        url = f"{self.AJAX_URL}/load-list-episode"
        params = {
            "ep_start": 0,
            "ep_end": anime_data.get("episodes", 100),
            "id": anime_data.get("gogoanime_id", anime_id)
        }
        
        try:
            async with self.session.get(url, params=params) as response:
                if response.status != 200:
                    return []
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                episode_links = soup.find_all('a')
                
                for link in episode_links:
                    episode_data = self._parse_episode_link(link)
                    if episode_data:
                        episodes.append(episode_data)
                
                return episodes
                
        except Exception as e:
            logger.error(f"Error fetching episodes from GogoAnime: {str(e)}")
            return []
    
    async def get_video_sources(self, episode_id: str) -> List[Dict]:
        """Получить источники видео для эпизода"""
        
        url = f"{self.BASE_URL}/{episode_id}"
        
        try:
            async with self.session.get(url) as response:
                if response.status != 200:
                    return []
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Ищем iframe с видео
                iframe = soup.find('iframe', {'id': 'playerframe'})
                if not iframe or not iframe.get('src'):
                    return []
                
                iframe_url = iframe['src']
                if not iframe_url.startswith('http'):
                    iframe_url = urljoin(self.BASE_URL, iframe_url)
                
                # Получаем прямые ссылки из iframe
                return await self._extract_video_from_iframe(iframe_url)
                
        except Exception as e:
            logger.error(f"Error fetching video sources from GogoAnime: {str(e)}")
            return []
    
    async def _extract_video_from_iframe(self, iframe_url: str) -> List[Dict]:
        """Извлечь видео ссылки из iframe"""
        
        sources = []
        
        try:
            async with self.session.get(iframe_url) as response:
                if response.status != 200:
                    return sources
                
                html = await response.text()
                
                # Ищем ссылки на видео в JavaScript коде
                video_patterns = [
                    r'"file":"([^"]+\.m3u8[^"]*)"',
                    r'"file":"([^"]+\.mp4[^"]*)"',
                    r'file:\s*"([^"]+\.m3u8[^"]*)"',
                    r'file:\s*"([^"]+\.mp4[^"]*)"'
                ]
                
                for pattern in video_patterns:
                    matches = re.findall(pattern, html)
                    for match in matches:
                        # Декодируем URL если нужно
                        video_url = match.replace('\\/', '/')
                        
                        # Определяем качество из URL или названия
                        quality = self._extract_quality_from_url(video_url)
                        
                        source = {
                            "source_name": "gogoanime",
                            "video_url": video_url,
                            "quality": quality,
                            "subtitle_url": None,
                            "is_active": True
                        }
                        
                        sources.append(source)
                
        except Exception as e:
            logger.error(f"Error extracting video from iframe: {str(e)}")
        
        return sources
    
    def _parse_anime_page(self, soup: BeautifulSoup) -> Dict:
        """Парсить страницу аниме"""
        
        title_elem = soup.find('h1')
        title = title_elem.text.strip() if title_elem else ""
        
        # Извлекаем изображение
        img_elem = soup.find('div', class_='anime_info_body_bg').find('img') if soup.find('div', class_='anime_info_body_bg') else None
        cover_image = img_elem['src'] if img_elem and img_elem.get('src') else None
        
        # Извлекаем информацию из списка
        info_list = soup.find('p', class_='type')
        episodes_count = 0
        status = "Unknown"
        
        if info_list:
            info_text = info_list.get_text()
            # Ищем количество эпизодов
            episode_match = re.search(r'(\d+)\s*episodes?', info_text, re.IGNORECASE)
            if episode_match:
                episodes_count = int(episode_match.group(1))
        
        # Извлекаем описание
        description_elem = soup.find('div', class_='description')
        description = description_elem.get_text().strip() if description_elem else ""
        
        return {
            "gogoanime_id": self._extract_id_from_url(soup.find('link', {'rel': 'canonical'})['href'] if soup.find('link', {'rel': 'canonical'}) else ""),
            "title_romaji": title,
            "title_english": title,
            "title_native": None,
            "description": self._clean_text(description),
            "cover_image": cover_image,
            "banner_image": None,
            "episodes": episodes_count,
            "duration": None,
            "status": status,
            "start_date": None,
            "end_date": None,
            "season": None,
            "season_year": None,
            "average_score": None,
            "popularity": None,
            "is_adult": False,
            "genres": [],
            "studios": [],
            "source": "gogoanime"
        }
    
    def _parse_search_item(self, item) -> Optional[Dict]:
        """Парсить элемент поиска"""
        
        try:
            link = item.find('a')
            if not link:
                return None
            
            title = link.get('title', '').strip()
            href = link.get('href', '')
            
            img = item.find('img')
            cover_image = img.get('src') if img else None
            
            return {
                "gogoanime_id": self._extract_id_from_url(href),
                "title_romaji": title,
                "title_english": title,
                "title_native": None,
                "description": "",
                "cover_image": cover_image,
                "episodes": None,
                "status": "Unknown",
                "source": "gogoanime"
            }
            
        except Exception as e:
            logger.error(f"Error parsing search item: {str(e)}")
            return None
    
    def _parse_episode_link(self, link) -> Optional[Dict]:
        """Парсить ссылку на эпизод"""
        
        try:
            href = link.get('href', '')
            text = link.get_text().strip()
            
            # Извлекаем номер эпизода
            episode_match = re.search(r'EP\s*(\d+)', text, re.IGNORECASE)
            episode_number = int(episode_match.group(1)) if episode_match else 1
            
            return {
                "gogoanime_episode_id": href.split('/')[-1] if href else "",
                "episode_number": episode_number,
                "title": f"Episode {episode_number}",
                "description": None,
                "air_date": None,
                "duration": None,
                "thumbnail": None
            }
            
        except Exception as e:
            logger.error(f"Error parsing episode link: {str(e)}")
            return None
    
    def _extract_id_from_url(self, url: str) -> str:
        """Извлечь ID из URL"""
        if not url:
            return ""
        
        # Убираем домен и параметры
        path = urlparse(url).path
        # Берем последний сегмент пути
        return path.split('/')[-1] if path else ""
    
    def _extract_quality_from_url(self, url: str) -> str:
        """Извлечь качество видео из URL"""
        
        quality_patterns = [
            (r'1080p?', '1080p'),
            (r'720p?', '720p'),
            (r'480p?', '480p'),
            (r'360p?', '360p')
        ]
        
        for pattern, quality in quality_patterns:
            if re.search(pattern, url, re.IGNORECASE):
                return quality
        
        # По умолчанию
        if '.m3u8' in url:
            return 'HLS'
        else:
            return '720p'
