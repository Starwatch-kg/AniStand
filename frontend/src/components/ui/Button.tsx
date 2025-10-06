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
    primary: 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300',
    secondary: 'bg-dark-lighter hover:bg-gray-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-glow transition-all duration-300 transform hover:scale-105',
    ghost: 'text-gray-300 hover:bg-dark-lighter hover:text-white transition-all duration-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        font-bold rounded-xl relative overflow-hidden
        before:absolute before:inset-0 before:bg-white/10 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300
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
