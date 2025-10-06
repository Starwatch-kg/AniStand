import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const RouteLoadingBar: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return <div className="route-loading-bar" />;
};
