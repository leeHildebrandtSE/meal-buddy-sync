import React, { useEffect } from 'react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';
import { ServiceSyncLogo } from '@/components/ServiceSyncLogo';
import { StepIndicator } from '@/components/StepIndicator';
import { Timer } from '@/components/Timer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QrCode, Play, FileText, Clock, CheckCircle } from 'lucide-react';

export const NurseStation: React.FC = () => {
  const { state, dispatch } = useServiceSync();

  useEffect(() => {
    // Add nurse station timestamp when component mounts
    dispatch({
      type: 'ADD_TIMESTAMP',
      payload: { key: 'serviceStart', value: new Date() }
    });
  }, [dispatch]);

  const handleStartServing = () => {
    dispatch({ type: 'SET_STEP', payload: 'service-progress' });
  };

  const handleViewPatientList = () => {
    // Placeholder for patient list functionality
    console.log('View patient list');
  };

  const startTime = state.sessionData.timestamps.kitchenExit || new Date();
  const travelTime = state.sessionData.timestamps.wardArrival && state.sessionData.timestamps.kitchenExit
    ? Math.floor((state.sessionData.timestamps.wardArrival.getTime() - state.sessionData.timestamps.kitchenExit.getTime()) / 1000)
    : 0;
  const nurseResponseTime = state.sessionData.timestamps.nurseResponse && state.sessionData.timestamps.nurseAlerted
    ? Math.floor((state.sessionData.timestamps.nurseResponse.getTime() - state.sessionData.timestamps.nurseAlerted.getTime()) / 1000)
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <ServiceSyncLogo size="md" />
          <Timer 
            startTime={startTime}
            label="Total Elapsed"
            variant="compact"
          />
        </div>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={6}
          totalSteps={8}
          stepTitle="Final Step: Begin Serving Process"
        />

        {/* QR Scanner Card */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center animate-pulse">
              <QrCode className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                🏥 Scan Nurse Station QR
              </h3>
              <p className="text-muted-foreground">
                Final QR code to start serving
              </p>
            </div>
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-success font-medium text-sm">
                ✅ QR Code Scanned Successfully
              </p>
            </div>
          </div>
        </Card>

        {/* Nurse Station Info */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">🏥 Nurse Station - Ward 3A</h3>
                <p className="text-sm text-muted-foreground">
                  Diet Nurse: {state.sessionData.nurseInfo?.name || 'Mary Williams'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Meal Type:</span>
                <p className="font-medium capitalize">{state.sessionData.mealData.type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Meal Count:</span>
                <p className="font-medium">{state.sessionData.mealData.count} meals</p>
              </div>
            </div>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-primary text-sm font-medium">
                ✅ {state.sessionData.mealData.count} {state.sessionData.mealData.type} meals verified and ready
              </p>
            </div>
          </div>
        </Card>

        {/* Service Summary */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Service Summary</h3>
            </div>
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
                  {travelTime > 0 && (
                    <span className="text-primary ml-1">({formatTime(travelTime)})</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diet Sheet:</span>
                <span className="font-medium text-success">Captured ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nurse Response:</span>
                <span className="font-medium">
                  {nurseResponseTime > 0 ? formatTime(nurseResponseTime) : '--'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ready to serve:</span>
                <span className="font-medium text-primary">{state.sessionData.mealData.count} meals</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleStartServing}
            className="w-full"
            size="mobile"
          >
            <Play className="w-5 h-5" />
            Start Serving Patients
          </Button>
          
          <Button 
            onClick={handleViewPatientList}
            variant="outline" 
            className="w-full"
            size="mobile"
          >
            <FileText className="w-5 h-5" />
            View Patient List
          </Button>
        </div>
      </div>
    </div>
  );
};