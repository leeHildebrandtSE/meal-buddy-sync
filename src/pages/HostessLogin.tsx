import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ServiceSyncLogo } from '@/components/ServiceSyncLogo';
import { LogIn, FileText, Clock, MapPin } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';

export const HostessLogin: React.FC = () => {
  const { state, dispatch } = useServiceSync();

  const handleLogin = () => {
    dispatch({ type: 'SET_STEP', payload: 'kitchen-scan' });
    dispatch({ 
      type: 'ADD_TIMESTAMP', 
      payload: { key: 'kitchenExit', value: new Date() }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* App Header */}
        <div className="text-center space-y-4">
          <ServiceSyncLogo size="lg" className="mx-auto" />
          <div>
            <h1 className="text-3xl font-bold text-primary">ServiceSync</h1>
            <p className="text-muted-foreground">Hospital Meal Delivery Tracking</p>
          </div>
        </div>

        {/* Employee Information Card */}
        <Card className="p-6 shadow-card animate-slide-up">
          <h2 className="text-xl font-bold text-foreground mb-4">Employee Login</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                <div className="mt-1 p-3 bg-muted rounded-lg text-sm font-mono">
                  {state.sessionData.hostessId}
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Hostess Name</label>
                <div className="mt-1 p-3 bg-muted rounded-lg text-sm font-semibold">
                  {state.sessionData.hostessName}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Shift Schedule</label>
              <div className="mt-1 p-3 bg-muted rounded-lg text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Morning Shift - 7:00 AM
              </div>
            </div>
          </div>
        </Card>

        {/* Hospital Assignment Card */}
        <Card className="p-6 shadow-card border-l-4 border-primary animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-foreground mb-2">Hospital Assignment</h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-semibold">General Hospital - Western Cape</span>
              </p>
              <p className="text-sm text-success font-medium">
                ✅ Ward assignments ready for today
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button 
            onClick={handleLogin}
            size="mobile" 
            variant="scanner"
            className="w-full"
          >
            <LogIn className="w-5 h-5" />
            🔐 Login & Start Shift
          </Button>
          
          <Button 
            variant="outline" 
            size="mobile"
            className="w-full"
          >
            <FileText className="w-5 h-5" />
            📋 View Previous Reports
          </Button>
        </div>

        {/* Status Info */}
        <div className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Ready to begin meal delivery tracking
        </div>
      </div>
    </div>
  );
};