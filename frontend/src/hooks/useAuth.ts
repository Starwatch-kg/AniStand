import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { login, register, logout } from '@/store/slices/authSlice';
import { LoginCredentials, RegisterCredentials } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(login(credentials));
      if (login.fulfilled.match(result)) {
        navigate('/');
      }
      return result;
    },
    [dispatch, navigate]
  );

  const handleRegister = useCallback(
    async (credentials: RegisterCredentials) => {
      const result = await dispatch(register(credentials));
      if (register.fulfilled.match(result)) {
        navigate('/');
      }
      return result;
    },
    [dispatch, navigate]
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};
