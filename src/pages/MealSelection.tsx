import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceSyncLogo } from '@/components/ServiceSyncLogo';
import { StepIndicator } from '@/components/StepIndicator';
import { 
  Coffee, 
  Sun, 
  Sunset, 
  Moon, 
  MapPin,
  Users,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Utensils
} from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';
import { useAuth } from '@/hooks/useAuth';
import { ServiceSyncAPI } from '@/services/api';

interface MealTypeOption {
  value: 'breakfast' | 'lunch' | 'supper' | 'beverages';
  label: string;
  icon: React.ReactNode;
  timeRange: string;
  description: string;
}

interface WardOption {
  id: string;
  wardId: string;
  name: string;
  capacity: number;
  floor: string;
  wing: string;
}

export const MealSelection: React.FC = () => {
  const { state, dispatch } = useServiceSync();
  const { user } = useAuth();
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [mealCount, setMealCount] = useState<number>(12);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mealTypes: MealTypeOption[] = [
    {
      value: 'breakfast',
      label: 'Breakfast',
      icon: <Sun className="w-6 h-6" />,
      timeRange: '06:00 - 09:00',
      description: 'Morning meal service'
    },
    {
      value: 'lunch',
      label: 'Lunch',
      icon: <Utensils className="w-6 h-6" />,
      timeRange: '11:30 - 14:00',
      description: 'Midday meal service'
    },
    {
      value: 'supper',
      label: 'Supper',
      icon: <Sunset className="w-6 h-6" />,
      timeRange: '17:00 - 19:30',
      description: 'Evening meal service'
    },
    {
      value: 'beverages',
      label: 'Beverages',
      icon: <Coffee className="w-6 h-6" />,
      timeRange: 'All Day',
      description: 'Hot drinks & refreshments'
    }
  ];

  const availableWards: WardOption[] = [
    {
      id: '223e4567-e89b-12d3-a456-426614174001',
      wardId: '3A',
      name: 'Ward 3A - General Medicine',
      capacity: 32,
      floor: '3',
      wing: 'A'
    },
    {
      id: '223e4567-e89b-12d3-a456-426614174002',
      wardId: '4B',
      name: 'Ward 4B - Cardiac Unit',
      capacity: 24,
      floor: '4',
      wing: 'B'
    },
    {
      id: '223e4567-e89b-12d3-a456-426614174003',
      wardId: '2C',
      name: 'Ward 2C - Pediatrics',
      capacity: 20,
      floor: '2',
      wing: 'C'
    },
    {
      id: '223e4567-e89b-12d3-a456-426614174004',
      wardId: '5A',
      name: 'Ward 5A - Surgery',
      capacity: 28,
      floor: '5',
      wing: 'A'
    }
  ];

  const getCurrentTimeRecommendation = (): string => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'breakfast';
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 17 && hour < 20) return 'supper';
    return 'beverages';
  };

  const handleCreateSession = async () => {
    if (!selectedMealType || !selectedWard || !mealCount) {
      setError('Please select meal type, ward, and enter meal count');
      return;
    }

    if (mealCount < 1 || mealCount > 50) {
      setError('Meal count must be between 1 and 50');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const sessionResponse = await ServiceSyncAPI.createSession({
        hospitalId: '123e4567-e89b-12d3-a456-426614174001',
        wardId: selectedWard,
        mealType: selectedMealType as 'breakfast' | 'lunch' | 'supper' | 'beverages',
        mealCount: mealCount
      });

      if (sessionResponse.success) {
        const selectedWardInfo = availableWards.find(w => w.id === selectedWard);
        
        dispatch({ 
          type: 'UPDATE_SESSION', 
          payload: { 
            sessionId: sessionResponse.session.session_id,
            wardId: selectedWardInfo?.wardId || '3A',
            mealData: {
              type: selectedMealType as 'breakfast' | 'lunch' | 'supper' | 'beverages',
              count: mealCount,
              served: 0
            }
          }
        });
        
        dispatch({ type: 'SET_STEP', payload: 'kitchen-scan' });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  const recommendedMealType = getCurrentTimeRecommendation();
  const selectedWardInfo = availableWards.find(w => w.id === selectedWard);

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <ServiceSyncLogo size="md" className="mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Setup Delivery Session</h1>
          <p className="text-sm text-muted-foreground">
            Welcome, {user?.firstName}! Configure your meal delivery.
          </p>
        </div>

        <StepIndicator 
          currentStep={1} 
          totalSteps={5} 
          stepTitle="Configure Delivery"
          className="animate-slide-up"
        />

        {/* Error Display */}
        {error && (
          <Card className="p-4 shadow-card border-l-4 border-destructive">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <div>
                <h3 className="font-bold text-destructive">Configuration Error</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Meal Type Selection */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-bold text-foreground mb-4">🍽️ Select Meal Type</h3>
          
          <div className="space-y-3">
            {mealTypes.map((mealType) => (
              <div
                key={mealType.value}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedMealType === mealType.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${mealType.value === recommendedMealType ? 'ring-2 ring-success/20' : ''}`}
                onClick={() => setSelectedMealType(mealType.value)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedMealType === mealType.value ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {mealType.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{mealType.label}</h4>
                      {mealType.value === recommendedMealType && (
                        <span className="text-xs bg-success text-white px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{mealType.timeRange}</p>
                    <p className="text-xs text-muted-foreground">{mealType.description}</p>
                  </div>
                  {selectedMealType === mealType.value && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Ward Selection */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-bold text-foreground mb-4">🏥 Select Ward</h3>
          
          <Select value={selectedWard} onValueChange={setSelectedWard}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose destination ward" />
            </SelectTrigger>
            <SelectContent>
              {availableWards.map((ward) => (
                <SelectItem key={ward.id} value={ward.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-medium">{ward.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Floor {ward.floor}{ward.wing} • {ward.capacity} beds
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedWardInfo && (
            <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Ward Selected: {selectedWardInfo.name}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Floor {selectedWardInfo.floor}{selectedWardInfo.wing} • Capacity: {selectedWardInfo.capacity} patients
              </p>
            </div>
          )}
        </Card>

        {/* Meal Count */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold text-foreground mb-4">📊 Number of {selectedMealType || 'Items'}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                {selectedMealType === 'beverages' ? 'Number of beverages to serve' : 'Number of meals to serve'}
              </label>
              <Input
                type="number"
                value={mealCount}
                onChange={(e) => setMealCount(parseInt(e.target.value) || 0)}
                min="1"
                max="50"
                className="text-center text-lg font-bold"
                placeholder="Enter count"
              />
            </div>

            {selectedWardInfo && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ward capacity:</span>
                <span className="font-medium">{selectedWardInfo.capacity} beds</span>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2">
              {[8, 12, 16, 24].map((count) => (
                <Button
                  key={count}
                  variant="outline"
                  size="sm"
                  onClick={() => setMealCount(count)}
                  className={mealCount === count ? 'border-primary bg-primary/5' : ''}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Session Summary */}
        {selectedMealType && selectedWard && mealCount > 0 && (
          <Card className="p-6 shadow-card border-l-4 border-success animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-bold text-foreground mb-4">📋 Session Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hostess:</span>
                <span className="font-medium">{user?.firstName} {user?.lastName} ({user?.employeeId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Meal Type:</span>
                <span className="font-medium capitalize">{selectedMealType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination:</span>
                <span className="font-medium">{selectedWardInfo?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{mealCount} {selectedMealType === 'beverages' ? 'beverages' : 'meals'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Time:</span>
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Create Session Button */}
        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <Button 
            onClick={handleCreateSession}
            size="mobile" 
            variant="default"
            className="w-full"
            disabled={!selectedMealType || !selectedWard || !mealCount || isCreating || mealCount < 1}
          >
            <ArrowRight className="w-5 h-5" />
            {isCreating ? 'Creating Session...' : '🚀 Start Delivery Session'}
          </Button>
        </div>

        {/* Quick Setup Options */}
        <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <h4 className="font-bold text-foreground mb-3">⚡ Quick Setup</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedMealType('breakfast');
                setSelectedWard('223e4567-e89b-12d3-a456-426614174001');
                setMealCount(12);
              }}
            >
              🌅 Ward 3A Breakfast
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedMealType('beverages');
                setSelectedWard('223e4567-e89b-12d3-a456-426614174002');
                setMealCount(24);
              }}
            >
              ☕ Ward 4B Beverages
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};