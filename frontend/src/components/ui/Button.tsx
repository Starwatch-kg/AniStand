import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-primary hover:shadow-primary-lg transform hover:scale-110 transition-all duration-300 btn-magnetic btn-press',
    secondary: 'glass-morphism hover:bg-white/20 text-white shadow-depth-md hover:shadow-depth-lg transform hover:scale-110 transition-all duration-300 btn-magnetic btn-press border border-white/10',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-primary transition-all duration-300 transform hover:scale-110 btn-press',
    ghost: 'text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 btn-press',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        font-bold rounded-xl relative overflow-hidden
        before:absolute before:inset-0 before:bg-white/10 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-500
        after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:translate-x-[-200%] hover:after:translate-x-[200%] after:transition-transform after:duration-700
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="relative z-10">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Загрузка...
          </span>
        ) : children}
      </span>
    </button>
  );
};
