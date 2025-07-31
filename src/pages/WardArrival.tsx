import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StepIndicator } from '@/components/StepIndicator';
import { Timer } from '@/components/Timer';
import { CheckCircle, QrCode, AlertCircle } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';
import { ServiceSyncAPI } from '@/services/api';

export const WardArrival: React.FC = () => {
  const { state, dispatch } = useServiceSync();
  const [comments, setComments] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wardScanned, setWardScanned] = useState(false);

  // Auto-scan ward QR code when component mounts
  useEffect(() => {
    const autoScanWard = async () => {
      if (!state.sessionData.sessionId) return;

      try {
        setIsScanning(true);
        const response = await ServiceSyncAPI.scanQRCode('WARD_GH001_3A', state.sessionData.sessionId);
        
        if (response.success) {
          setWardScanned(true);
          dispatch({ 
            type: 'ADD_TIMESTAMP', 
            payload: { key: 'wardArrival', value: new Date() }
          });
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Ward scan failed');
      } finally {
        setIsScanning(false);
      }
    };

    // Auto-scan after 1 second
    setTimeout(autoScanWard, 1000);
  }, [state.sessionData.sessionId, dispatch]);

  const handleContinue = () => {
    dispatch({ 
      type: 'UPDATE_SESSION', 
      payload: { documentation: { ...state.sessionData.documentation, comments } }
    });
    dispatch({ type: 'SET_STEP', payload: 'diet-sheet' });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        
        <StepIndicator 
          currentStep={2} 
          totalSteps={4} 
          stepTitle="Ward 3A - General Medicine"
          className="animate-slide-up"
        />

        {/* Ward Scan Status */}
        {isScanning ? (
          <Card className="p-4 shadow-card border-l-4 border-warning animate-pulse">
            <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6 text-warning animate-pulse" />
              <div>
                <h3 className="font-bold text-warning">📱 Scanning Ward QR Code...</h3>
                <p className="text-sm text-muted-foreground">Confirming arrival at Ward 3A</p>
              </div>
            </div>
          </Card>
        ) : wardScanned ? (
          <Card className="p-4 shadow-card border-l-4 border-success animate-slide-up">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-success" />
              <div>
                <h3 className="font-bold text-success">✅ Ward 3A QR Scanned Successfully</h3>
                <p className="text-sm text-muted-foreground">
                  Arrived: {new Date().toLocaleTimeString()} • Travel time: {Math.floor((Date.now() - state.sessionData.shiftTime.getTime()) / 1000 / 60)}m
                </p>
              </div>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-4 shadow-card border-l-4 border-destructive">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <div>
                <h3 className="font-bold text-destructive">Ward Scan Error</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </Card>
        ) : null}

        {/* Trip Duration */}
        <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Timer 
            startTime={state.sessionData.shiftTime}
            label="Trip Duration"
            variant="large"
            className="justify-center"
          />
        </Card>

        {/* Session Summary */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold text-foreground mb-4">📋 Delivery Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Session ID</span>
              <span className="font-mono text-sm">{state.sessionData.sessionId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Ward</span>
              <span className="font-medium">3A - General Medicine</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Meal Type</span>
              <span className="font-medium">🌅 {state.sessionData.mealData.type}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Meal Count</span>
              <span className="font-medium">{state.sessionData.mealData.count} meals</span>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-bold text-foreground mb-4">📝 Optional Comments</h3>
          <Textarea
            placeholder="Report any operational issues, dietary restrictions noted, or incidents during transport..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="min-h-20"
          />
        </Card>

        {/* Continue Button */}
        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <Button 
            onClick={handleContinue}
            size="mobile" 
            variant="default"
            className="w-full"
            disabled={!wardScanned}
          >
            📋 Continue to Diet Sheet Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};