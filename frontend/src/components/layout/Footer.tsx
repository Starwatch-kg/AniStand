import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-card border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold mb-4">
              <span className="text-white">Ani</span>
              <span className="text-primary">Stand</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Ваша платформа для просмотра аниме онлайн. Смотрите любимые аниме в высоком качестве.
            </p>
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} AniStand. Все права защищены.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Библиотека
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Информация</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Контакты
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Пользовательское соглашение
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
