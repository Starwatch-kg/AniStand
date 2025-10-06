import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: Record<string, string> = {
    catalog: 'Каталог',
    anime: 'Аниме',
    watch: 'Просмотр',
    library: 'Библиотека',
    login: 'Вход',
    register: 'Регистрация',
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4 overflow-x-auto">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap"
      >
        <Home size={16} />
        <span>Главная</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = breadcrumbNameMap[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={16} className="text-gray-600" />
            {isLast ? (
              <span className="text-white font-medium whitespace-nowrap">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-white transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
