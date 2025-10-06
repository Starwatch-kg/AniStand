import { useState, useCallback } from 'react';
import { ToastData, ToastType } from '@/components/ui/ToastContainer';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((
    type: ToastType,
    message: string,
    description?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      id,
      type,
      message,
      description,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, description?: string) => {
    return addToast('success', message, description);
  }, [addToast]);

  const error = useCallback((message: string, description?: string) => {
    return addToast('error', message, description);
  }, [addToast]);

  const info = useCallback((message: string, description?: string) => {
    return addToast('info', message, description);
  }, [addToast]);

  const warning = useCallback((message: string, description?: string) => {
    return addToast('warning', message, description);
  }, [addToast]);

  return {
    toasts,
    success,
    error,
    info,
    warning,
    removeToast,
  };
};
