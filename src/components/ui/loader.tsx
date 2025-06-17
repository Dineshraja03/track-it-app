
import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        {/* Rotating coins */}
        <div className="absolute inset-0 animate-spin">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-lg animate-bounce"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-yellow-300 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.25s' }}></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-yellow-600 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.75s' }}></div>
        </div>
        
        {/* Center rupee symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-yellow-600 font-bold text-lg animate-pulse">₹</span>
        </div>
      </div>
    </div>
  );
};

export { Loader };
