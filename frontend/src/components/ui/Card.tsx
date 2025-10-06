import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
  hover = false,
}) => {
  return (
    <div
      className={`
        bg-dark-card rounded-lg overflow-hidden border border-white/5
        ${hover ? 'transition-all duration-300 hover:scale-102 hover:shadow-xl cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};
