import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StepIndicator } from '@/components/StepIndicator';
import { Camera, FileText, CheckCircle, Bell, AlertTriangle } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';
import { ServiceSyncAPI } from '@/services/api';

export const DietSheet: React.FC = () => {
  const { state, dispatch } = useServiceSync();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [nurseAlerted, setNurseAlerted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    try {
      setIsUploading(true);
      setError(null);

      // Upload diet sheet photo
      const response = await ServiceSyncAPI.uploadDietSheet(state.sessionData.sessionId!, {
        fileName: 'diet_sheet_ward_3a.jpg',
        capturedAt: new Date().toISOString()
      });

      if (response.success) {
        setPhotoTaken(true);
        dispatch({ 
          type: 'ADD_TIMESTAMP', 
          payload: { key: 'dietSheetCaptured', value: new Date() }
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Photo upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAlertNurse = async () => {
    try {
      const response = await ServiceSyncAPI.sendNurseAlert(state.sessionData.sessionId!);
      
      if (response.success) {
        setNurseAlerted(true);
        dispatch({ 
          type: 'ADD_TIMESTAMP', 
          payload: { key: 'nurseAlerted', value: new Date() }
        });
        
        // Auto-advance after nurse alert
        setTimeout(() => {
          dispatch({ type: 'SET_STEP', payload: 'completion' });
        }, 2000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Nurse alert failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        
        <StepIndicator 
          currentStep={3} 
          totalSteps={4} 
          stepTitle="Document Diet Sheet"
          className="animate-slide-up"
        />

        {/* Error Display */}
        {error && (
          <Card className="p-4 shadow-card border-l-4 border-destructive">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <h3 className="font-bold text-destructive">Error</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Photo Capture */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-center space-y-4">
            <div className={`w-full h-48 rounded-lg border-2 border-dashed ${photoTaken ? 'border-success bg-success/5' : 'border-primary bg-primary/5'} flex items-center justify-center`}>
              {photoTaken ? (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                  <p className="text-sm font-medium text-success">Diet Sheet Documented</p>
                  <p className="text-xs text-muted-foreground">Uploaded to backend system</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Tap to capture diet sheet</p>
                </div>
              )}
            </div>
            
            {!photoTaken && (
              <Button 
                onClick={handleTakePhoto}
                size="mobile" 
                variant="scanner"
                className="w-full"
                disabled={isUploading}
              >
                <Camera className="w-5 h-5" />
                {isUploading ? 'Uploading...' : '📷 Capture Diet Sheet'}
              </Button>
            )}
          </div>
        </Card>

        {/* Nurse Alert */}
        {photoTaken && (
          <Card className="p-6 shadow-card animate-slide-up">
            <div className="text-center space-y-4">
              <div className={`w-full h-32 rounded-lg border-2 ${nurseAlerted ? 'border-success bg-success/5' : 'border-warning bg-warning/5'} flex items-center justify-center`}>
                {nurseAlerted ? (
                  <div className="text-center">
                    <CheckCircle className="w-10 h-10 text-success mx-auto mb-2" />
                    <p className="text-sm font-medium text-success">Nurse Successfully Alerted</p>
                    <p className="text-xs text-muted-foreground">Proceeding to final step...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Bell className="w-10 h-10 text-warning mx-auto mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Ready to alert nurse</p>
                  </div>
                )}
              </div>
              
              {!nurseAlerted && (
                <Button 
                  onClick={handleAlertNurse}
                  size="mobile" 
                  variant="default"
                  className="w-full"
                >
                  <Bell className="w-5 h-5" />
                  🔔 Alert Nurse - Ready to Serve
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};