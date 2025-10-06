'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, User, Heart, History } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-anime-purple to-anime-pink rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold gradient-text">AniStand</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
              Главная
            </Link>
            <Link href="/anime" className="text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
              Каталог
            </Link>
            <Link href="/genres" className="text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
              Жанры
            </Link>
            <Link href="/top" className="text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
              Топ
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск аниме..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-purple focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </form>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/favorites" className="p-2 text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/history" className="p-2 text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
              <History className="h-5 w-5" />
            </Link>
            <Link href="/profile" className="p-2 text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/auth/login" className="anime-button">
              Войти
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск аниме..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-purple focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link href="/" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
                Главная
              </Link>
              <Link href="/anime" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
                Каталог
              </Link>
              <Link href="/genres" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
                Жанры
              </Link>
              <Link href="/top" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
                Топ
              </Link>
              <Link href="/favorites" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
                Избранное
              </Link>
              <Link href="/history" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
                История
              </Link>
              <Link href="/profile" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-anime-purple transition-colors">
                Профиль
              </Link>
              <Link href="/auth/login" className="block py-2 text-anime-purple font-medium">
                Войти
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
