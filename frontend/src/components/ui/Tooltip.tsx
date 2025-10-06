import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        
        let x = 0;
        let y = 0;

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2;
            y = rect.top;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2;
            y = rect.bottom;
            break;
          case 'left':
            x = rect.left;
            y = rect.top + rect.height / 2;
            break;
          case 'right':
            x = rect.right;
            y = rect.top + rect.height / 2;
            break;
        }

        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: '-translate-x-1/2 -translate-y-full mb-2',
    bottom: '-translate-x-1/2 translate-y-2',
    left: '-translate-x-full -translate-y-1/2 mr-2',
    right: 'translate-x-2 -translate-y-1/2',
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: coords.x, top: coords.y }}
        >
          <div
            className={`
              px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl
              border border-gray-700 whitespace-nowrap animate-fade-in
              ${positionClasses[position]}
            `}
          >
            {content}
            {/* Arrow */}
            <div
              className={`
                absolute w-2 h-2 bg-gray-900 border-gray-700 transform rotate-45
                ${position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b' : ''}
                ${position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t' : ''}
                ${position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-r border-t' : ''}
                ${position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-l border-b' : ''}
              `}
            />
          </div>
        </div>
      )}
    </>
  );
};
