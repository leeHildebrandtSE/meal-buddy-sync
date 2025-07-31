import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { StepIndicator } from '@/components/StepIndicator';
import { Camera, FileText, CheckCircle, RotateCcw, SkipForward } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';

export const DietSheet: React.FC = () => {
  const { state, dispatch } = useServiceSync();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [captureTime, setCaptureTime] = useState<Date | null>(null);

  const handlePhotoCapture = () => {
    // Simulate photo capture
    const timestamp = new Date();
    setPhotoTaken(true);
    setCaptureTime(timestamp);
    // Create a mock photo URL
    setPhotoUrl('data:image/jpeg;base64,mock-diet-sheet-photo');
    
    dispatch({ 
      type: 'ADD_TIMESTAMP', 
      payload: { key: 'dietSheetCaptured', value: timestamp }
    });
  };

  const handleRetakePhoto = () => {
    setPhotoTaken(false);
    setPhotoUrl('');
    setCaptureTime(null);
  };

  const handleContinue = () => {
    dispatch({ 
      type: 'UPDATE_SESSION', 
      payload: { 
        documentation: { 
          ...state.sessionData.documentation, 
          additionalNotes,
          dietSheetPhoto: photoUrl
        }
      }
    });
    dispatch({ type: 'SET_STEP', payload: 'nurse-alert' });
  };

  const handleSkip = () => {
    dispatch({ type: 'SET_STEP', payload: 'nurse-alert' });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        
        <StepIndicator 
          currentStep={3} 
          totalSteps={4} 
          stepTitle="Document meal requirements"
          className="animate-slide-up"
        />

        {/* Information Card */}
        <Card className="p-6 shadow-card border-l-4 border-info animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start gap-4">
            <FileText className="w-6 h-6 text-info flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-foreground mb-2">📋 Record Requirement</h3>
              <p className="text-sm text-muted-foreground">
                Capture diet sheet/list for meal serving documentation and compliance records
              </p>
            </div>
          </div>
        </Card>

        {/* Photo Capture Area */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-bold text-foreground mb-4">Diet Sheet Photography</h3>
          
          {!photoTaken ? (
            <div className="text-center space-y-4">
              <div className="w-full h-40 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Ready to capture diet sheet</p>
                </div>
              </div>
              
              <Button 
                onClick={handlePhotoCapture}
                variant="scanner"
                size="mobile"
                className="w-full"
              >
                <Camera className="w-5 h-5" />
                📷 Capture Diet Sheet Photo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-success">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                  <p className="text-sm font-medium text-success">Photo Captured</p>
                  <p className="text-xs text-muted-foreground">
                    {captureTime?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleRetakePhoto}
                  variant="outline"
                  size="default"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  🔄 Retake Photo
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Photo Status */}
        {photoTaken && (
          <Card className="p-4 shadow-card border-l-4 border-success animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-success" />
              <div>
                <h3 className="font-bold text-success">✅ Documentation Complete</h3>
                <p className="text-sm text-muted-foreground">
                  Diet sheet captured and stored securely
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Additional Notes */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-bold text-foreground mb-4">Additional Notes</h3>
          <Textarea
            placeholder="Any special dietary requirements or notes from the diet sheet..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="min-h-20"
          />
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <Button 
            onClick={handleContinue}
            size="mobile" 
            variant="default"
            className="w-full"
            disabled={!photoTaken}
          >
            📋 Confirm & Alert Nurse
          </Button>
          
          <Button 
            onClick={handleSkip}
            variant="outline" 
            size="mobile"
            className="w-full"
          >
            <SkipForward className="w-5 h-5" />
            ⏭️ Skip Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};