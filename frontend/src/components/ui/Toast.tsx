import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  description,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle size={24} className="text-green-500" />,
    error: <AlertCircle size={24} className="text-red-500" />,
    info: <Info size={24} className="text-blue-500" />,
    warning: <AlertTriangle size={24} className="text-yellow-500" />,
  };

  const styles = {
    success: 'border-green-500 bg-green-500/10',
    error: 'border-red-500 bg-red-500/10',
    info: 'border-blue-500 bg-blue-500/10',
    warning: 'border-yellow-500 bg-yellow-500/10',
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border-l-4 backdrop-blur-sm
        ${styles[type]} animate-slide-up shadow-xl
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold mb-1">{message}</p>
        {description && (
          <p className="text-gray-300 text-sm">{description}</p>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X size={18} className="text-gray-400" />
      </button>
    </div>
  );
};
