import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StepIndicator } from '@/components/StepIndicator';
import { Timer } from '@/components/Timer';
import { QrCode, Camera, Truck, Edit3, AlertCircle, CheckCircle } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';
import { ServiceSyncAPI } from '@/services/api';

export const KitchenScan: React.FC = () => {
  const { state, dispatch } = useServiceSync();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScanSuccess = async () => {
    if (!state.sessionData.sessionId) {
      setError('No active session found');
      return;
    }

    try {
      setIsScanning(true);
      setError(null);

      // Scan the kitchen QR code with real API call
      const response = await ServiceSyncAPI.scanQRCode('KITCHEN_GH001_MAIN', state.sessionData.sessionId);
      
      if (response.success) {
        setScanSuccess(true);
        dispatch({ 
          type: 'ADD_TIMESTAMP', 
          payload: { key: 'kitchenExit', value: new Date() }
        });
        
        // Auto-advance after 2 seconds
        setTimeout(() => {
          dispatch({ type: 'SET_STEP', payload: 'ward-arrival' });
        }, 2000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'QR scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    // Simulate QR scan after 2 seconds
    setTimeout(() => {
      handleScanSuccess();
    }, 2000);
  };

  if (scanSuccess) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-md mx-auto space-y-6 pt-4">
          <Card className="p-6 shadow-card border-l-4 border-success text-center">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-success mb-2">✅ Kitchen Exit Confirmed!</h2>
            <p className="text-muted-foreground">Proceeding to Ward 3A...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        
        <StepIndicator 
          currentStep={1} 
          totalSteps={4} 
          stepTitle="Scan Kitchen QR Code"
          className="animate-slide-up"
        />

        {/* Error Display */}
        {error && (
          <Card className="p-4 shadow-card border-l-4 border-destructive">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <div>
                <h3 className="font-bold text-destructive">Scan Error</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Scanner Area */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-center space-y-4">
            <div className={`w-64 h-64 mx-auto rounded-xl border-4 border-dashed border-primary bg-primary/5 flex items-center justify-center relative overflow-hidden ${isScanning ? 'shadow-scanner animate-pulse-scanner' : ''}`}>
              {isScanning ? (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-primary mx-auto mb-2 animate-pulse" />
                  <p className="text-sm font-medium text-primary">Scanning Kitchen QR...</p>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Position kitchen QR code within frame</p>
                  <p className="text-xs text-muted-foreground mt-2">QR Code: KITCHEN_GH001_MAIN</p>
                </div>
              )}
              
              {/* Scanning overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="w-full h-1 bg-primary animate-pulse"></div>
                </div>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Scan the kitchen QR code to confirm trolley departure
            </p>
          </div>
        </Card>

        {/* Session Info */}
        <Card className="p-4 shadow-card border-l-4 border-success animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-success" />
            <div>
              <h3 className="font-bold text-foreground">🚛 Session Active</h3>
              <p className="text-sm text-muted-foreground">
                Session ID: {state.sessionData.sessionId}
              </p>
              <p className="text-sm text-muted-foreground">
                Breakfast meals: {state.sessionData.mealData.count}
              </p>
            </div>
          </div>
        </Card>

        {/* Timer */}
        <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Timer 
            startTime={state.sessionData.shiftTime}
            label="Session Time"
            variant="large"
            className="justify-center"
          />
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={startScanning}
            size="mobile" 
            variant="scanner"
            className="w-full"
            disabled={isScanning || !state.sessionData.sessionId}
          >
            <Camera className="w-5 h-5" />
            {isScanning ? 'Scanning...' : '✅ Scan Kitchen QR Code'}
          </Button>
          
          <Button 
            onClick={handleScanSuccess}
            variant="outline" 
            size="mobile"
            className="w-full"
            disabled={isScanning}
          >
            <Edit3 className="w-5 h-5" />
            📝 Manual Confirmation
          </Button>
        </div>
      </div>
    </div>
  );
};