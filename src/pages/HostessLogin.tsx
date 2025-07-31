import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ServiceSyncLogo } from '@/components/ServiceSyncLogo';
import { LogIn, FileText, Clock, MapPin, AlertCircle } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';
import { useAuth } from '@/hooks/useAuth';
import { ServiceSyncAPI } from '@/services/api';

export const HostessLogin: React.FC = () => {
  const { dispatch } = useServiceSync();
  const { login, isLoading, error } = useAuth();
  const [employeeId, setEmployeeId] = useState('H001'); // Pre-filled for demo
  const [password, setPassword] = useState('password123'); // Pre-filled for demo
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoginError(null);
    
    const success = await login(employeeId, password);
    
    if (success) {
      // Create a new delivery session
      try {
        const sessionResponse = await ServiceSyncAPI.createSession({
          hospitalId: '123e4567-e89b-12d3-a456-426614174001', // General Hospital
          wardId: '223e4567-e89b-12d3-a456-426614174001', // Ward 3A
          mealType: 'breakfast',
          mealCount: 12
        });

        if (sessionResponse.success) {
          dispatch({ 
            type: 'UPDATE_SESSION', 
            payload: { 
              sessionId: sessionResponse.session.session_id,
              wardId: '3A'
            }
          });
          dispatch({ type: 'SET_STEP', payload: 'kitchen-scan' });
        }
      } catch (error) {
        setLoginError('Failed to create delivery session');
      }
    } else {
      setLoginError(error || 'Login failed');
    }
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

        {/* Login Form */}
        <Card className="p-6 shadow-card animate-slide-up">
          <h2 className="text-xl font-bold text-foreground mb-4">Employee Login</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
              <Input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="mt-1"
              />
            </div>

            {(loginError || error) && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive">{loginError || error}</span>
              </div>
            )}

            <Button 
              onClick={handleLogin}
              disabled={isLoading || !employeeId || !password}
              size="mobile" 
              variant="scanner"
              className="w-full"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? 'Logging in...' : '🔐 Login & Start Shift'}
            </Button>
          </div>
        </Card>

        {/* Demo Credentials */}
        <Card className="p-4 shadow-card border-l-4 border-info animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-bold text-foreground mb-2">🔑 Demo Credentials</h3>
          <div className="text-sm space-y-1">
            <p><strong>Hostess:</strong> H001 / password123</p>
            <p><strong>Nurse:</strong> N001 / password123</p>
            <p><strong>Admin:</strong> ADMIN001 / password123</p>
          </div>
        </Card>

        {/* Hospital Assignment */}
        <Card className="p-6 shadow-card border-l-4 border-primary animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-foreground mb-2">Hospital Assignment</h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-semibold">General Hospital - Western Cape</span>
              </p>
              <p className="text-sm text-success font-medium">
                ✅ Ward 3A ready for breakfast service
              </p>
            </div>
          </div>
        </Card>

        {/* System Status */}
        <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-success">Backend connected: localhost:3001</span>
          </div>
        </Card>
      </div>
    </div>
  );
};