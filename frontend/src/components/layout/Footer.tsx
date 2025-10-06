import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-dark-900 to-black border-t border-white/10 mt-20 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl md:text-4xl font-black mb-4">
              <span className="text-white">Ani</span>
              <span className="text-gradient-animated">Stand</span>
            </div>
            <p className="text-gray-400 text-base mb-6 max-w-md leading-relaxed">
              Ваша платформа для просмотра аниме онлайн. Смотрите любимые аниме в высоком качестве.
            </p>
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} AniStand. Все права защищены.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Навигация</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1 inline-block link-animated">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1 inline-block link-animated">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1 inline-block link-animated">
                  Библиотека
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Информация</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1 inline-block link-animated">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1 inline-block link-animated">
                  Контакты
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1 inline-block link-animated">
                  Политика
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary text-sm transition-all hover:translate-x-1 inline-block link-animated">
                  Соглашение
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
