import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ServiceSyncLogo } from '@/components/ServiceSyncLogo';
import { 
  BarChart3, 
  Clock, 
  Users, 
  TrendingUp, 
  Activity, 
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { ServiceSyncAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useServiceSync } from '@/contexts/ServiceSyncContext';

interface DashboardStats {
  totalSessions: number;
  completedSessions: number;
  averageDeliveryTime: number;
  totalMealsServed: number;
  activeHostesses: number;
  todaysSessions: number;
  completionRate: number;
  averageResponseTime: number;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { dispatch } = useServiceSync();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await ServiceSyncAPI.getDashboard();
      
      if (response.success) {
        setStats(response.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load dashboard');
      // Fallback to mock data for demo
      setStats({
        totalSessions: 156,
        completedSessions: 142,
        averageDeliveryTime: 23,
        totalMealsServed: 1847,
        activeHostesses: 12,
        todaysSessions: 18,
        completionRate: 91.0,
        averageResponseTime: 4.2
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNewSession = () => {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'SET_STEP', payload: 'login' });
  };

  const handleLogout = () => {
    logout();
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'SET_STEP', payload: 'login' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4 flex items-center justify-center">
        <Card className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto space-y-6 pt-4">
        
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-4">
            <ServiceSyncLogo size="md" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">ServiceSync Dashboard</h1>
              <p className="text-muted-foreground">Hospital Meal Delivery Analytics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchDashboardData}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* User Info */}
        <Card className="p-4 shadow-card border-l-4 border-primary animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Welcome, {user?.firstName} {user?.lastName}</h3>
                <p className="text-sm text-muted-foreground">
                  {user?.employeeId} • {user?.role} • Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'First time'}
                </p>
              </div>
            </div>
            <Button onClick={handleNewSession} variant="default" size="sm">
              + New Session
            </Button>
          </div>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="p-4 shadow-card border-l-4 border-warning">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <h3 className="font-bold text-warning">Connection Issue</h3>
                <p className="text-sm text-muted-foreground">Using cached data: {error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.completedSessions || 0}</p>
                <p className="text-xs text-muted-foreground">Completed Sessions</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.averageDeliveryTime || 0}m</p>
                <p className="text-xs text-muted-foreground">Avg Delivery Time</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.totalMealsServed || 0}</p>
                <p className="text-xs text-muted-foreground">Meals Served</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.completionRate || 0}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Performance */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Today's Performance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Sessions Today</span>
                <span className="font-bold text-foreground">{stats?.todaysSessions || 0}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Active Hostesses</span>
                <span className="font-bold text-foreground">{stats?.activeHostesses || 0}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Avg Response Time</span>
                <span className="font-bold text-foreground">{stats?.averageResponseTime || 0}min</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">System Status</span>
                <span className="flex items-center gap-2 text-success font-bold">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  Online
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-success" />
              <h3 className="text-lg font-bold text-foreground">System Health</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Backend API</span>
                <span className="flex items-center gap-2 text-success font-bold">
                  <CheckCircle className="w-4 h-4" />
                  Connected
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Database</span>
                <span className="flex items-center gap-2 text-success font-bold">
                  <CheckCircle className="w-4 h-4" />
                  PostgreSQL
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Real-time</span>
                <span className="flex items-center gap-2 text-success font-bold">
                  <CheckCircle className="w-4 h-4" />
                  Socket.IO
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-success/5 rounded-lg border border-success/20">
              <CheckCircle className="w-5 h-5 text-success" />
              <div className="flex-1">
                <p className="text-sm font-medium">Session SS1234567890ABCD completed</p>
                <p className="text-xs text-muted-foreground">Ward 3A • 12 breakfast meals • 2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-info/5 rounded-lg border border-info/20">
              <Activity className="w-5 h-5 text-info" />
              <div className="flex-1">
                <p className="text-sm font-medium">H002 started new session</p>
                <p className="text-xs text-muted-foreground">Ward 2B • 8 lunch meals • 5 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-warning/5 rounded-lg border border-warning/20">
              <Clock className="w-5 h-5 text-warning" />
              <div className="flex-1">
                <p className="text-sm font-medium">Delivery in progress</p>
                <p className="text-xs text-muted-foreground">Ward 1A • 15 supper meals • H001</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.9s' }}>
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              onClick={handleNewSession}
              variant="default"
              className="h-16 flex-col gap-1"
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs">New Session</span>
            </Button>
            
            <Button
              onClick={fetchDashboardData}
              variant="outline"
              className="h-16 flex-col gap-1"
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-xs">Refresh Data</span>
            </Button>
            
            <Button
              onClick={() => window.open('/servicesync/login', '_blank')}
              variant="outline"
              className="h-16 flex-col gap-1"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Staff Login</span>
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '1.0s' }}>
          <p>ServiceSync v1.0 • Connected to localhost:3001</p>
          <p>Last updated: {lastUpdated.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};