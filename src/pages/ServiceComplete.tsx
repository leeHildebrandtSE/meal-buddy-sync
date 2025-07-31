import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Timer } from '@/components/Timer';
import { CheckCircle, RotateCcw, BarChart3, Home } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';

export const ServiceComplete: React.FC = () => {
  const { state, dispatch } = useServiceSync();

  const handleNextDelivery = () => {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'SET_STEP', payload: 'kitchen-scan' });
  };

  const handleReturnKitchen = () => {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'SET_STEP', payload: 'login' });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        
        {/* Success Header */}
        <Card className="p-6 shadow-elevated border-l-4 border-success animate-slide-up text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-success mb-2">🎉 Service Completed Successfully</h1>
          <p className="text-sm text-muted-foreground">
            All 12 breakfast meals served • 100% completion rate achieved
          </p>
        </Card>

        {/* Final Progress */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-bold text-foreground mb-4">✅ Final Progress: 12/12</h3>
          <div className="w-full bg-muted rounded-full h-4 mb-2">
            <div className="bg-gradient-primary h-4 rounded-full w-full"></div>
          </div>
          <p className="text-center text-2xl font-bold text-success">100%</p>
        </Card>

        {/* Total Duration */}
        <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-center">
            <h3 className="font-bold text-foreground mb-2">Total Service Duration</h3>
            <div className="text-3xl font-mono font-bold text-primary">00:20:11</div>
          </div>
        </Card>

        {/* Performance Report */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold text-foreground mb-4">📊 Performance Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kitchen Exit:</span>
              <span className="font-medium">8:16:12 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ward Arrival:</span>
              <span className="font-medium">8:19:34 AM (3m 22s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Diet Sheet:</span>
              <span className="font-medium text-success">Captured ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nurse Response:</span>
              <span className="font-medium">1m 25s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Serving Rate:</span>
              <span className="font-medium">0.6 meals/minute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Efficiency:</span>
              <span className="font-medium text-success">Excellent</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={handleNextDelivery}
            size="mobile" 
            variant="default"
            className="w-full"
          >
            <RotateCcw className="w-5 h-5" />
            🔄 Start Next Delivery
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="default">
              <BarChart3 className="w-4 h-4" />
              📊 Full Report
            </Button>
            <Button 
              onClick={handleReturnKitchen}
              variant="outline" 
              size="default"
            >
              <Home className="w-4 h-4" />
              🏠 Kitchen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};