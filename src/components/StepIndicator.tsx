import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  className = ''
}) => {
  return (
    <div className={`w-full p-4 bg-white rounded-lg shadow-card border-l-4 border-primary ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <div className="flex items-center text-primary">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
      </div>
      <h2 className="text-lg font-bold text-foreground">{stepTitle}</h2>
      <div className="w-full bg-muted rounded-full h-2 mt-3">
        <div 
          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};