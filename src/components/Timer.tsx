import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  startTime?: Date;
  label: string;
  isRunning?: boolean;
  className?: string;
  variant?: 'default' | 'large' | 'compact';
}

export const Timer: React.FC<TimerProps> = ({
  startTime = new Date(),
  label,
  isRunning = true,
  className = '',
  variant = 'default'
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const variantClasses = {
    default: 'text-base',
    large: 'text-2xl font-bold',
    compact: 'text-sm'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="w-4 h-4 text-primary" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <span className={`font-mono text-primary ${variantClasses[variant]}`}>
          {formatTime(elapsed)}
        </span>
      </div>
    </div>
  );
};