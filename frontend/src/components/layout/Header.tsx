import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, LogOut, Library, Star } from 'lucide-react';
import { useAuth } from '@/hooks';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo with gradient */}
          <Link to="/" className="text-2xl font-bold group flex items-center gap-1">
            <span className="text-white group-hover:text-primary transition-colors">Ani</span>
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Stand</span>
          </Link>

          {/* Clean Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                location.pathname === '/' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Главная
            </Link>
            <Link
              to="/catalog"
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                location.pathname === '/catalog' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Каталог
            </Link>
            <Link
              to="/library"
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                location.pathname === '/library' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Библиотека
            </Link>
          </nav>

          {/* Search & User */}
          <div className="flex items-center gap-4">
            {/* Modern Search */}
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск аниме..."
                  className="w-56 px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </form>

            {/* Modern User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-white hidden md:block font-medium">{user?.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-white/10 rounded-lg shadow-2xl overflow-hidden backdrop-blur-xl">
                    <Link
                      to="/library"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Library size={18} />
                      <span className="font-medium">Библиотека</span>
                    </Link>
                    <Link
                      to="/library?tab=favorites"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Star size={18} />
                      <span className="font-medium">Избранное</span>
                    </Link>
                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Выйти</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-primary/50"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
