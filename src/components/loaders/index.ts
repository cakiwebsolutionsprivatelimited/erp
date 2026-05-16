import React from 'react';
import { cn } from '@/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-primary border-r-transparent border-b-primary border-l-transparent",
        sizeClasses[size],
        className
      )}
    />
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading experience...</p>
      </div>
    </div>
  );
};
