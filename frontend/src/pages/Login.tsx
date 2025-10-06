import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuth } from '@/hooks';
import { Button, Input } from '@/components/ui';

export const Login: React.FC = () => {
  const { login, isAuthenticated, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (error) {
      setErrors({ general: error });
    }
  }, [error]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = 'Имя пользователя обязательно';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await login(formData);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black mb-3">
            <span className="text-white">Ani</span>
            <span className="text-gradient-animated">Stand</span>
          </h1>
          <p className="text-gray-400 text-lg">Войдите в свой аккаунт</p>
        </div>

        <div className="glass-morphism rounded-3xl p-8 md:p-10 shadow-depth-xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <Input
              type="text"
              name="username"
              label="Имя пользователя"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              icon={<User size={20} />}
              autoComplete="username"
            />

            <Input
              type="password"
              name="password"
              label="Пароль"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={20} />}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full text-lg font-black hover-glow"
            >
              Войти
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-base">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-primary hover:text-primary-light transition-colors font-bold link-animated">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 AniStand. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
};
