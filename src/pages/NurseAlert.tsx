import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StepIndicator } from '@/components/StepIndicator';
import { Timer } from '@/components/Timer';
import { AlertTriangle, CheckCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';

export const NurseAlert: React.FC = () => {
  const { state, dispatch } = useServiceSync();
  const [nurseResponded, setNurseResponded] = useState(false);
  const [nurseName, setNurseName] = useState('Mary Williams');
  const [responseTime, setResponseTime] = useState(85); // seconds
  const [alertTime] = useState(new Date());

  useEffect(() => {
    // Simulate nurse response after 85 seconds
    const timer = setTimeout(() => {
      setNurseResponded(true);
      dispatch({ 
        type: 'UPDATE_SESSION', 
        payload: { nurseInfo: { name: nurseName, responseTime } }
      });
    }, 2000); // Shortened for demo

    return () => clearTimeout(timer);
  }, []);

  const handleProceed = () => {
    dispatch({ type: 'SET_STEP', payload: 'nurse-station' });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        <StepIndicator 
          currentStep={4} 
          totalSteps={4} 
          stepTitle="Automatic Buzzer Notification"
          className="animate-slide-up"
        />

        {/* Buzzer Alert Animation */}
        <Card className="p-6 shadow-elevated border-l-4 border-warning animate-pulse-scanner">
          <div className="text-center space-y-4">
            <AlertTriangle className="w-16 h-16 text-warning mx-auto animate-pulse" />
            <div>
              <h2 className="text-xl font-bold text-warning">🚨 Diet Nurse Buzzer Activated</h2>
              <p className="text-sm text-muted-foreground">Ward 3A • 12 Breakfast Meals</p>
            </div>
          </div>
        </Card>

        {/* Buzzer Display */}
        <Card className="p-4 bg-warning text-warning-foreground shadow-elevated">
          <div className="text-center font-mono space-y-2">
            <div className="text-lg font-bold">⚠️ MEAL ALERT ⚠️</div>
            <div className="text-sm">Ward: 3A • Meal: BREAKFAST</div>
            <div className="text-sm">Count: 12 MEALS</div>
            <div className="text-sm">Hostess: S.JOHNSON • Time: {alertTime.toLocaleTimeString()}</div>
          </div>
        </Card>

        {/* Response Timer */}
        <Card className="p-4 shadow-card">
          <Timer 
            startTime={alertTime}
            label="Nurse Response Timer"
            variant="large"
            className="justify-center"
          />
        </Card>

        {/* Nurse Response */}
        {nurseResponded && (
          <Card className="p-4 shadow-card border-l-4 border-success animate-slide-up">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-success" />
              <div>
                <h3 className="font-bold text-success">✅ Nurse Acknowledged</h3>
                <p className="text-sm text-muted-foreground">
                  Diet Nurse: {nurseName} • Response time: 1m 25s
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleProceed}
            size="mobile" 
            variant="default"
            className="w-full"
            disabled={!nurseResponded}
          >
            <ArrowRight className="w-5 h-5" />
            ➡️ Proceed to Nurse Station
          </Button>
        </div>
      </div>
    </div>
  );
};