export interface SessionData {
  sessionId: string;
  hostessId: string;
  hostessName: string;
  hospitalId: string;
  wardId: string;
  shiftTime: Date;
  timestamps: {
    kitchenExit?: Date;
    wardArrival?: Date;
    dietSheetCaptured?: Date;
    nurseAlerted?: Date;
    nurseResponse?: Date;
    serviceStart?: Date;
    serviceComplete?: Date;
  };
  mealData: {
    type: 'breakfast' | 'lunch' | 'supper' | 'beverages';
    count: number;
    served: number;
  };
  documentation: {
    dietSheetPhoto?: string;
    comments: string;
    additionalNotes: string;
  };
  performance: {
    travelTime?: number;
    nurseResponseTime?: number;
    servingTime?: number;
    totalDuration?: number;
    efficiency?: number;
  };
  nurseInfo?: {
    name: string;
    responseTime: number;
  };
}

export interface UserData {
  employeeId: string;
  name: string;
  shift: string;
  hospitalAssignment: string;
  permissions: string[];
}

export type MealType = 'breakfast' | 'lunch' | 'supper' | 'beverages';

export interface QRScanResult {
  data: string;
  location: string;
  timestamp: Date;
}

export type WorkflowStep = 
  | 'login'
  | 'kitchen-scan'
  | 'ward-arrival'
  | 'diet-sheet'
  | 'nurse-alert'
  | 'nurse-station'
  | 'service-progress'
  | 'completion';