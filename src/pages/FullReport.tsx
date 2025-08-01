import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ServiceSyncLogo } from '@/components/ServiceSyncLogo';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  MapPin,
  Camera,
  Bell,
  Users,
  BarChart3
} from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';

export const FullReport: React.FC = () => {
  const { state, dispatch } = useServiceSync();

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 'completion' });
  };

  const handleExport = () => {
    // Simulate export functionality
    alert('📧 Report exported and sent to supervisor email');
  };

  const performanceData = [
    { metric: 'Total Duration', value: '20m 11s', status: 'excellent', target: '< 25m' },
    { metric: 'Travel Time', value: '3m 22s', status: 'good', target: '< 5m' },
    { metric: 'Nurse Response', value: '1m 25s', status: 'excellent', target: '< 3m' },
    { metric: 'Serving Rate', value: '0.6 meals/min', status: 'good', target: '> 0.5/min' },
    { metric: 'Documentation', value: 'Complete', status: 'excellent', target: '100%' },
    { metric: 'Efficiency Score', value: '94%', status: 'excellent', target: '> 90%' }
  ];

  const timelineData = [
    { step: 'Kitchen Exit', time: '8:16:12 AM', duration: '-', icon: MapPin, status: 'complete' },
    { step: 'Ward Arrival', time: '8:19:34 AM', duration: '3m 22s', icon: MapPin, status: 'complete' },
    { step: 'Diet Sheet Capture', time: '8:20:45 AM', duration: '1m 11s', icon: Camera, status: 'complete' },
    { step: 'Nurse Alert', time: '8:21:15 AM', duration: '30s', icon: Bell, status: 'complete' },
    { step: 'Nurse Response', time: '8:22:40 AM', duration: '1m 25s', icon: Users, status: 'complete' },
    { step: 'Service Start', time: '8:23:05 AM', duration: '25s', icon: CheckCircle, status: 'complete' },
    { step: 'Service Complete', time: '8:36:23 AM', duration: '13m 18s', icon: CheckCircle, status: 'complete' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'warning': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto space-y-6 pt-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            size="sm"
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <ServiceSyncLogo />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Report Header */}
        <Card className="p-6 shadow-elevated border-l-4 border-success">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">📊 Service Performance Report</h1>
              <p className="text-muted-foreground mt-1">Ward 3A • Breakfast Service • 12 Meals Delivered</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-success">94%</div>
              <div className="text-sm text-muted-foreground">Efficiency Score</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">20m 11s</div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">12/12</div>
              <div className="text-sm text-muted-foreground">Meals Served</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">A+</div>
              <div className="text-sm text-muted-foreground">Performance Grade</div>
            </div>
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6 shadow-card">
          <h3 className="font-bold text-foreground mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{item.metric}</div>
                  <div className="text-sm text-muted-foreground">Target: {item.target}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getStatusColor(item.status)}`}>{item.value}</div>
                  <div className="text-xs text-muted-foreground capitalize">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6 shadow-card">
          <h3 className="font-bold text-foreground mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            Complete Timeline
          </h3>
          <div className="space-y-4">
            {timelineData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{item.step}</div>
                    <div className="text-sm text-muted-foreground">{item.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-primary">{item.duration}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Service Details */}
        <Card className="p-6 shadow-card">
          <h3 className="font-bold text-foreground mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            Service Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Session Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hostess:</span>
                  <span className="font-medium">Sarah Johnson (H001)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shift:</span>
                  <span className="font-medium">Morning (7:00 AM)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hospital:</span>
                  <span className="font-medium">General Hospital - Western Cape</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ward:</span>
                  <span className="font-medium">3A - General Medicine</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diet Nurse:</span>
                  <span className="font-medium">Mary Williams</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Quality Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documentation:</span>
                  <span className="font-medium text-success">Complete ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diet Sheet:</span>
                  <span className="font-medium text-success">Captured ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">QR Scans:</span>
                  <span className="font-medium text-success">3/3 Complete ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Compliance:</span>
                  <span className="font-medium text-success">100% ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issues:</span>
                  <span className="font-medium text-success">None ✓</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Visualization */}
        <Card className="p-6 shadow-card">
          <h3 className="font-bold text-foreground mb-4">Service Progress Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Kitchen to Ward (Target: 5min)</span>
                <span className="text-sm font-medium text-success">3m 22s</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Documentation (Target: 2min)</span>
                <span className="text-sm font-medium text-success">1m 11s</span>
              </div>
              <Progress value={59} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Nurse Response (Target: 3min)</span>
                <span className="text-sm font-medium text-success">1m 25s</span>
              </div>
              <Progress value={47} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Meal Service (Target: 15min)</span>
                <span className="text-sm font-medium text-success">13m 18s</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pb-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Summary
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};