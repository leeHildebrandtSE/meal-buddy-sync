import React, { useEffect, useState } from 'react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';
import { ServiceSyncLogo } from '@/components/ServiceSyncLogo';
import { Timer } from '@/components/Timer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Pause, AlertTriangle, TrendingUp } from 'lucide-react';

export const ServiceProgress: React.FC = () => {
  const { state, dispatch } = useServiceSync();
  const [servedCount, setServedCount] = useState(0);

  useEffect(() => {
    // Auto-increment served meals every 2 seconds for simulation
    const interval = setInterval(() => {
      if (servedCount < state.sessionData.mealData.count) {
        const newCount = servedCount + 1;
        setServedCount(newCount);
        dispatch({
          type: 'UPDATE_MEAL_DATA',
          payload: { served: newCount }
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [servedCount, state.sessionData.mealData.count, dispatch]);

  const handleCompleteService = () => {
    dispatch({
      type: 'ADD_TIMESTAMP',
      payload: { key: 'serviceComplete', value: new Date() }
    });
    dispatch({ type: 'SET_STEP', payload: 'completion' });
  };

  const handlePauseTimer = () => {
    // Placeholder for pause functionality
    console.log('Timer paused');
  };

  const handleReportIssue = () => {
    // Placeholder for issue reporting
    console.log('Report issue');
  };

  const progressPercentage = Math.round((servedCount / state.sessionData.mealData.count) * 100);
  const startTime = state.sessionData.timestamps.serviceStart || new Date();
  
  // Calculate service rate (meals per minute)
  const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
  const serviceRate = elapsedSeconds > 0 ? (servedCount / (elapsedSeconds / 60)).toFixed(1) : '0.0';

  const formatDuration = (date1?: Date, date2?: Date) => {
    if (!date1 || !date2) return '--:--';
    const seconds = Math.floor((date2.getTime() - date1.getTime()) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <ServiceSyncLogo size="md" />
          <Timer 
            startTime={startTime}
            label="Serving Time"
            variant="compact"
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Service in Progress
          </h1>
          <p className="text-muted-foreground">
            Serving Patients - Ward 3A
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {servedCount} / {state.sessionData.mealData.count}
              </div>
              <p className="text-muted-foreground">meals served</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-primary">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
            
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-primary text-sm font-medium text-center">
                {state.sessionData.mealData.type.charAt(0).toUpperCase() + state.sessionData.mealData.type.slice(1)} meals being served to patients
              </p>
            </div>
          </div>
        </Card>

        {/* Service Metrics */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Service Metrics</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Service Rate</span>
                <p className="font-bold text-primary">{serviceRate} meals/min</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Efficiency</span>
                <p className="font-bold text-success">{progressPercentage}%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Session Summary */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Session Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kitchen Exit:</span>
                <span className="font-medium">
                  {state.sessionData.timestamps.kitchenExit?.toLocaleTimeString() || '--:--'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ward Arrival:</span>
                <span className="font-medium">
                  {state.sessionData.timestamps.wardArrival?.toLocaleTimeString() || '--:--'}
                  <span className="text-primary ml-1">
                    ({formatDuration(state.sessionData.timestamps.kitchenExit, state.sessionData.timestamps.wardArrival)})
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diet Sheet:</span>
                <span className="font-medium text-success">Captured ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nurse Response:</span>
                <span className="font-medium">
                  {formatDuration(state.sessionData.timestamps.nurseAlerted, state.sessionData.timestamps.nurseResponse)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Rate:</span>
                <span className="font-medium text-primary">{serviceRate} meals/minute</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleCompleteService}
            className="w-full"
            size="mobile"
            disabled={servedCount < state.sessionData.mealData.count}
          >
            <CheckCircle className="w-5 h-5" />
            Complete Service
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handlePauseTimer}
              variant="outline" 
              size="mobile"
            >
              <Pause className="w-4 h-4" />
              Pause Timer
            </Button>
            
            <Button 
              onClick={handleReportIssue}
              variant="warning" 
              size="mobile"
            >
              <AlertTriangle className="w-4 h-4" />
              Report Issue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};