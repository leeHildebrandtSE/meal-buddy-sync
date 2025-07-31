import React from 'react';

interface ServiceSyncLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ServiceSyncLogo: React.FC<ServiceSyncLogoProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <div className="relative w-full h-full">
        {/* Three overlapping circles representing sync/coordination */}
        <div className="absolute top-0 left-0 w-8 h-8 bg-primary rounded-full opacity-90 animate-pulse"></div>
        <div className="absolute top-1 left-3 w-8 h-8 bg-primary-light rounded-full opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-2 left-1.5 w-8 h-8 bg-muted-foreground rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};