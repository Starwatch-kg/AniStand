import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-anime-purple to-anime-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold gradient-text">AniStand</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Современная платформа для просмотра аниме онлайн. 
              Смотрите любимые аниме в высоком качестве с удобным интерфейсом.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/Starwatch-kg/AniStand" 
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/anime" className="text-gray-400 hover:text-white transition-colors">
                  Каталог аниме
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-gray-400 hover:text-white transition-colors">
                  Жанры
                </Link>
              </li>
              <li>
                <Link href="/top" className="text-gray-400 hover:text-white transition-colors">
                  Топ аниме
                </Link>
              </li>
              <li>
                <Link href="/random" className="text-gray-400 hover:text-white transition-colors">
                  Случайное аниме
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Помощь
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Связаться с нами
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 AniStand. Все права защищены.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Сделано с <Heart className="h-4 w-4 text-red-500 mx-1" /> командой AniStand
          </p>
        </div>
      </div>
    </footer>
  );
}
