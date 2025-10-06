export const formatDate = (date: { year: number | null; month: number | null; day: number | null }): string => {
  if (!date.year) return 'Неизвестно';
  
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  
  if (date.month && date.day) {
    return `${date.day} ${months[date.month - 1]} ${date.year}`;
  }
  if (date.month) {
    return `${months[date.month - 1]} ${date.year}`;
  }
  return `${date.year}`;
};

export const formatDuration = (minutes: number | null): string => {
  if (!minutes) return 'Неизвестно';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours} ч ${mins} мин`;
  }
  return `${mins} мин`;
};

export const formatScore = (score: number | null): string => {
  if (!score) return 'N/A';
  return (score / 10).toFixed(1);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    год: 31536000,
    месяц: 2592000,
    неделя: 604800,
    день: 86400,
    час: 3600,
    минута: 60,
  };

  for (const [name, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${name}${interval > 1 ? (name === 'час' ? 'а' : name === 'месяц' ? 'а' : 'ы') : ''} назад`;
    }
  }

  return 'только что';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};
