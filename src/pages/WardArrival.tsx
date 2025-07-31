import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StepIndicator } from '@/components/StepIndicator';
import { Timer } from '@/components/Timer';
import { CheckCircle, Coffee, Sun, Moon, Sunrise, Plus, Minus } from 'lucide-react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';
import { MealType } from '@/types/serviceSync';

export const WardArrival: React.FC = () => {
  const { state, dispatch } = useServiceSync();
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [mealCount, setMealCount] = useState(12);
  const [comments, setComments] = useState('');

  const mealTypes = [
    { type: 'breakfast' as MealType, icon: Sunrise, label: '🌅 Breakfast', selected: selectedMealType === 'breakfast' },
    { type: 'lunch' as MealType, icon: Sun, label: '☀️ Lunch', selected: selectedMealType === 'lunch' },
    { type: 'supper' as MealType, icon: Moon, label: '🌙 Supper', selected: selectedMealType === 'supper' },
    { type: 'beverages' as MealType, icon: Coffee, label: '☕ Beverages', selected: selectedMealType === 'beverages' },
  ];

  const handleContinue = () => {
    dispatch({ 
      type: 'UPDATE_MEAL_DATA', 
      payload: { type: selectedMealType, count: mealCount } 
    });
    dispatch({ 
      type: 'UPDATE_SESSION', 
      payload: { documentation: { ...state.sessionData.documentation, comments } }
    });
    dispatch({ type: 'SET_STEP', payload: 'diet-sheet' });
  };

  const adjustMealCount = (delta: number) => {
    const newCount = Math.max(1, Math.min(50, mealCount + delta));
    setMealCount(newCount);
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

        {/* Success Notification */}
        <Card className="p-4 shadow-card border-l-4 border-success animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-success" />
            <div>
              <h3 className="font-bold text-success">✅ Ward QR Scanned Successfully</h3>
              <p className="text-sm text-muted-foreground">
                Arrived: {new Date().toLocaleTimeString()} • Travel time: 3m 22s
              </p>
            </div>
          </div>
        </Card>

        {/* Trip Duration */}
        <Card className="p-4 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Timer 
            startTime={state.sessionData.timestamps.kitchenExit || new Date()}
            label="Trip Duration"
            variant="large"
            className="justify-center"
          />
        </Card>

        {/* Meal Type Selection */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold text-foreground mb-4">Select Meal Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {mealTypes.map((meal) => (
              <Button
                key={meal.type}
                variant={meal.selected ? "default" : "outline"}
                className="h-16 flex-col gap-1"
                onClick={() => setSelectedMealType(meal.type)}
              >
                <meal.icon className="w-5 h-5" />
                <span className="text-xs">{meal.label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Meal Count */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-bold text-foreground mb-4">📊 Number of Meals to Serve</h3>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustMealCount(-1)}
              disabled={mealCount <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <Input
                type="number"
                value={mealCount}
                onChange={(e) => setMealCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="w-20 text-center text-xl font-bold"
                min="1"
                max="50"
              />
              <p className="text-xs text-muted-foreground mt-1">meals</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustMealCount(1)}
              disabled={mealCount >= 50}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Comments */}
        <Card className="p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="font-bold text-foreground mb-4">Optional Comments</h3>
          <Textarea
            placeholder="Report any operational issues, dietary restrictions noted, or incidents during transport..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="min-h-20"
          />
        </Card>

        {/* Continue Button */}
        <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Button 
            onClick={handleContinue}
            size="mobile" 
            variant="default"
            className="w-full"
          >
            📋 Continue to Diet Sheet
          </Button>
        </div>
      </div>
    </div>
  );
};