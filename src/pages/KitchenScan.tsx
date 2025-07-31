import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StepIndicator } from '@/components/StepIndicator';
import { Timer } from '@/components/Timer';
import { QrCode, Camera, Truck, Edit3 } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';

export const KitchenScan: React.FC = () => {
  const { state, dispatch } = useServiceSync();
  const [isScanning, setIsScanning] = useState(false);

  const handleScanSuccess = () => {
    dispatch({ 
      type: 'ADD_TIMESTAMP', 
      payload: { key: 'kitchenExit', value: new Date() }
    });
    dispatch({ type: 'SET_STEP', payload: 'ward-arrival' });
  };

  const handleManualEntry = () => {
    // For demo purposes, we'll proceed as if scan succeeded
    handleScanSuccess();
  };

  const startScanning = () => {
    setIsScanning(true);
    // Simulate QR scan after 2 seconds
    setTimeout(() => {
      setIsScanning(false);
      handleScanSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        
        <StepIndicator 
          currentStep={1} 
          totalSteps={4} 
          stepTitle="Scan Kitchen QR Code"
          className="animate-slide-up"
        />

        {/* Scanner Area */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-center space-y-4">
            <div className={`w-64 h-64 mx-auto rounded-xl border-4 border-dashed border-primary bg-primary/5 flex items-center justify-center relative overflow-hidden ${isScanning ? 'shadow-scanner animate-pulse-scanner' : ''}`}>
              {isScanning ? (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-primary mx-auto mb-2 animate-pulse" />
                  <p className="text-sm font-medium text-primary">Scanning...</p>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Position QR code within frame</p>
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
              Scan the kitchen QR code to track trolley departure
            </p>
          </div>
        </Card>

        {/* Status Card */}
        <Card className="p-4 shadow-card border-l-4 border-success animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-success" />
            <div>
              <h3 className="font-bold text-foreground">🚛 Ready to Depart</h3>
              <p className="text-sm text-muted-foreground">
                Trolley loaded with patient meals
              </p>
            </div>
          </div>
        </Card>

        {/* Timer */}
        <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Timer 
            startTime={state.sessionData.timestamps.kitchenExit || new Date()}
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
            disabled={isScanning}
          >
            <Camera className="w-5 h-5" />
            {isScanning ? 'Scanning...' : '✅ Confirm Kitchen Exit'}
          </Button>
          
          <Button 
            onClick={handleManualEntry}
            variant="outline" 
            size="mobile"
            className="w-full"
          >
            <Edit3 className="w-5 h-5" />
            📝 Manual Entry
          </Button>
        </div>
      </div>
    </div>
  );
};