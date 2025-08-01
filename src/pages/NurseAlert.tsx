import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StepIndicator } from '@/components/StepIndicator';
import { Timer } from '@/components/Timer';
import { Bell, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';
import { ServiceSyncAPI } from '@/services/api';

export const NurseAlert: React.FC = () => {
  const { state, dispatch } = useServiceSync();
  const [alertSent, setAlertSent] = useState(false);
  const [nurseResponded, setNurseResponded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertTime, setAlertTime] = useState<Date | null>(null);
  const [responseTime, setResponseTime] = useState<Date | null>(null);

  const handleSendAlert = async () => {
    if (!state.sessionData.sessionId) {
      setError('No active session found');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await ServiceSyncAPI.sendNurseAlert(state.sessionData.sessionId);
      
      if (response.success) {
        setAlertSent(true);
        const now = new Date();
        setAlertTime(now);
        dispatch({ 
          type: 'ADD_TIMESTAMP', 
          payload: { key: 'nurseAlerted', value: now }
        });

        // Simulate nurse response after 85 seconds (shortened to 3 seconds for demo)
        setTimeout(() => {
          const responseTime = new Date();
          setNurseResponded(true);
          setResponseTime(responseTime);
          dispatch({ 
            type: 'ADD_TIMESTAMP', 
            payload: { key: 'nurseResponse', value: responseTime }
          });
          
          // Auto-advance to next step after nurse responds
          setTimeout(() => {
            dispatch({ type: 'SET_STEP', payload: 'nurse-station' });
          }, 2000);
        }, 3000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Alert failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getElapsedTime = () => {
    if (!alertTime) return '00:00';
    const now = responseTime || new Date();
    const elapsed = Math.floor((now.getTime() - alertTime.getTime()) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        
        <StepIndicator 
          currentStep={4} 
          totalSteps={8} 
          stepTitle="Alert Nurse Station"
          className="animate-slide-up"
        />

        {/* Error Display */}
        {error && (
          <Card className="p-4 shadow-card border-l-4 border-destructive">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <h3 className="font-bold text-destructive">Alert Error</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Alert Status */}
        <Card className={`p-6 shadow-card border-l-4 ${alertSent ? 'border-success' : 'border-warning'} animate-slide-up`}>
          <div className="text-center space-y-4">
            {!alertSent ? (
              <>
                <Bell className="w-16 h-16 text-warning mx-auto" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">Ready to Alert Nurse</h2>
                  <p className="text-sm text-muted-foreground">
                    Ward 3A • {state.sessionData.mealData.count} {state.sessionData.mealData.type} meals
                  </p>
                </div>
              </>
            ) : nurseResponded ? (
              <>
                <CheckCircle className="w-16 h-16 text-success mx-auto" />
                <div>
                  <h2 className="text-xl font-bold text-success">✅ Nurse Responded!</h2>
                  <p className="text-sm text-muted-foreground">
                    Response time: {getElapsedTime()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Diet Nurse: Mary Williams • Proceeding to nurse station...
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Bell className="w-16 h-16 text-warning mx-auto animate-pulse" />
                  <div className="absolute -top-1 -right-1">
                    <div className="w-4 h-4 bg-warning rounded-full animate-ping"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-warning">🚨 Alert Sent - Waiting for Response</h2>
                  <p className="text-sm text-muted-foreground">
                    Nurse buzzer activated • Ward 3A
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Timer */}
        {alertSent && !nurseResponded && (
          <Card className="p-4 shadow-card animate-slide-up">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Response Timer</h3>
              </div>
              <div className="text-3xl font-mono font-bold text-primary">
                {getElapsedTime()}
              </div>
              <p className="text-sm text-muted-foreground">
                Average response time: 1-3 minutes
              </p>
            </div>
          </Card>
        )}

        {/* Session Info */}
        <Card className="p-4 shadow-card border-l-4 border-primary animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-3">
            <h3 className="font-bold text-foreground">📋 Delivery Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Ward:</span>
                <p className="font-medium">3A - General Medicine</p>
              </div>
              <div>
                <span className="text-muted-foreground">Meal Type:</span>
                <p className="font-medium capitalize">{state.sessionData.mealData.type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Count:</span>
                <p className="font-medium">{state.sessionData.mealData.count} meals</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-medium text-success">Ready to Serve ✓</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Alert Button */}
        {!alertSent && (
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              onClick={handleSendAlert}
              size="mobile" 
              variant="warning"
              className="w-full"
              disabled={isLoading}
            >
              <Bell className="w-5 h-5" />
              {isLoading ? 'Sending Alert...' : '🔔 Send Nurse Alert'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};