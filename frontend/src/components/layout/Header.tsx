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
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/10 shadow-depth-xl backdrop-blur-2xl">
      {/* Animated gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo with gradient and animation */}
          <Link to="/" className="text-3xl font-black group flex items-center gap-1 hover:scale-105 transition-transform">
            <span className="text-white group-hover:text-gradient-animated transition-all">Ani</span>
            <span className="text-gradient-animated">Stand</span>
          </Link>

          {/* Enhanced Navigation with hover effects */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 ${
                location.pathname === '/' 
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Главная
            </Link>
            <Link
              to="/catalog"
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 ${
                location.pathname === '/catalog' 
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Каталог
            </Link>
            <Link
              to="/library"
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 ${
                location.pathname === '/library' 
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Библиотека
            </Link>
          </nav>

          {/* Enhanced Search & User */}
          <div className="flex items-center gap-5">
            {/* Enhanced Search with glow */}
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск аниме..."
                  className="w-64 px-5 py-3 pl-12 glass-morphism border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all group-hover:border-white/20"
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </form>

            {/* Enhanced User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all hover:scale-105 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary-dark to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                    <User size={20} className="text-white" />
                  </div>
                  <span className="text-white hidden md:block font-bold">{user?.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 glass-morphism border border-white/20 rounded-2xl shadow-depth-xl overflow-hidden animate-scale-in">
                    <Link
                      to="/library"
                      className="flex items-center gap-3 px-5 py-4 text-gray-300 hover:bg-white/10 hover:text-white transition-all group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Library size={20} className="group-hover:scale-110 transition-transform" />
                      <span className="font-semibold">Библиотека</span>
                    </Link>
                    <Link
                      to="/library?tab=favorites"
                      className="flex items-center gap-3 px-5 py-4 text-gray-300 hover:bg-white/10 hover:text-white transition-all group"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Star size={20} className="group-hover:scale-110 transition-transform" />
                      <span className="font-semibold">Избранное</span>
                    </Link>
                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-5 py-4 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all group"
                    >
                      <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                      <span className="font-semibold">Выйти</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/50 hover:scale-105"
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
