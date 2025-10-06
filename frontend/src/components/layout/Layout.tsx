import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Header />
      <main className={`flex-1 pt-20 page-wrapper ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
