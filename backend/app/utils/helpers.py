from typing import Dict, List, Any, Optional
import hashlib
import re
from datetime import datetime, date
import asyncio
from loguru import logger


def generate_cache_key(*args, **kwargs) -> str:
    """Генерировать ключ кеша на основе аргументов"""
    key_data = str(args) + str(sorted(kwargs.items()))
    return hashlib.md5(key_data.encode()).hexdigest()


def clean_html(text: str) -> str:
    """Очистить текст от HTML тегов"""
    if not text:
        return ""
    
    # Удаляем HTML теги
    clean = re.compile('<.*?>')
    text = re.sub(clean, '', text)
    
    # Удаляем лишние пробелы
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()


def extract_year_from_date(date_str: str) -> Optional[int]:
    """Извлечь год из строки даты"""
    if not date_str:
        return None
    
    try:
        # Пытаемся найти год в строке
        year_match = re.search(r'\b(19|20)\d{2}\b', date_str)
        if year_match:
            return int(year_match.group())
        
        # Пытаемся парсить как дату
        if '-' in date_str:
            return int(date_str.split('-')[0])
        
        return None
    except (ValueError, AttributeError):
        return None


def format_duration(seconds: int) -> str:
    """Форматировать длительность в читаемый вид"""
    if not seconds:
        return "Unknown"
    
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    
    if hours > 0:
        return f"{hours}h {minutes}m"
    else:
        return f"{minutes}m"


def normalize_title(title: str) -> str:
    """Нормализовать название для поиска"""
    if not title:
        return ""
    
    # Приводим к нижнему регистру
    title = title.lower()
    
    # Удаляем специальные символы
    title = re.sub(r'[^\w\s]', '', title)
    
    # Удаляем лишние пробелы
    title = re.sub(r'\s+', ' ', title)
    
    return title.strip()


def extract_episode_number(title: str) -> Optional[int]:
    """Извлечь номер эпизода из названия"""
    if not title:
        return None
    
    patterns = [
        r'episode\s*(\d+)',
        r'ep\s*(\d+)',
        r'эпизод\s*(\d+)',
        r'серия\s*(\d+)',
        r'\b(\d+)\b'  # Любое число
    ]
    
    for pattern in patterns:
        match = re.search(pattern, title.lower())
        if match:
            return int(match.group(1))
    
    return None


def validate_url(url: str) -> bool:
    """Проверить валидность URL"""
    if not url:
        return False
    
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    return url_pattern.match(url) is not None


def safe_int(value: Any, default: int = 0) -> int:
    """Безопасное преобразование в int"""
    try:
        if value is None:
            return default
        return int(value)
    except (ValueError, TypeError):
        return default


def safe_float(value: Any, default: float = 0.0) -> float:
    """Безопасное преобразование в float"""
    try:
        if value is None:
            return default
        return float(value)
    except (ValueError, TypeError):
        return default


def truncate_text(text: str, max_length: int = 200) -> str:
    """Обрезать текст до указанной длины"""
    if not text:
        return ""
    
    if len(text) <= max_length:
        return text
    
    return text[:max_length-3] + "..."


def extract_quality_from_filename(filename: str) -> str:
    """Извлечь качество видео из имени файла"""
    if not filename:
        return "Unknown"
    
    quality_patterns = {
        r'1080p?': '1080p',
        r'720p?': '720p',
        r'480p?': '480p',
        r'360p?': '360p',
        r'4k|2160p?': '4K',
        r'hd': 'HD',
        r'sd': 'SD'
    }
    
    filename_lower = filename.lower()
    
    for pattern, quality in quality_patterns.items():
        if re.search(pattern, filename_lower):
            return quality
    
    return "Unknown"


def merge_dicts(*dicts: Dict) -> Dict:
    """Объединить несколько словарей"""
    result = {}
    for d in dicts:
        if d:
            result.update(d)
    return result


def chunk_list(lst: List, chunk_size: int) -> List[List]:
    """Разбить список на части"""
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]


async def run_with_timeout(coro, timeout: float):
    """Выполнить корутину с таймаутом"""
    try:
        return await asyncio.wait_for(coro, timeout=timeout)
    except asyncio.TimeoutError:
        logger.warning(f"Operation timed out after {timeout} seconds")
        return None


def get_season_from_date(date_obj: date) -> Optional[str]:
    """Определить сезон по дате"""
    if not date_obj:
        return None
    
    month = date_obj.month
    
    if month in [12, 1, 2]:
        return "WINTER"
    elif month in [3, 4, 5]:
        return "SPRING"
    elif month in [6, 7, 8]:
        return "SUMMER"
    elif month in [9, 10, 11]:
        return "FALL"
    
    return None


def format_file_size(size_bytes: int) -> str:
    """Форматировать размер файла в читаемый вид"""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {size_names[i]}"


def sanitize_filename(filename: str) -> str:
    """Санитизировать имя файла"""
    if not filename:
        return "unknown"
    
    # Удаляем недопустимые символы
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    
    # Заменяем пробелы на подчеркивания
    filename = re.sub(r'\s+', '_', filename)
    
    # Ограничиваем длину
    if len(filename) > 100:
        filename = filename[:100]
    
    return filename.lower()


class RateLimiter:
    """Простой rate limiter"""
    
    def __init__(self, max_calls: int, time_window: float):
        self.max_calls = max_calls
        self.time_window = time_window
        self.calls = []
    
    async def acquire(self) -> bool:
        """Проверить, можно ли выполнить запрос"""
        now = datetime.now().timestamp()
        
        # Удаляем старые вызовы
        self.calls = [call_time for call_time in self.calls 
                     if now - call_time < self.time_window]
        
        if len(self.calls) < self.max_calls:
            self.calls.append(now)
            return True
        
        return False
    
    async def wait_if_needed(self):
        """Ждать, если нужно соблюдать rate limit"""
        while not await self.acquire():
            await asyncio.sleep(0.1)
