import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SessionData, WorkflowStep } from '@/types/serviceSync';

interface ServiceSyncState {
  currentStep: WorkflowStep;
  sessionData: SessionData;
  isLoading: boolean;
  error: string | null;
}

type ServiceSyncAction = 
  | { type: 'SET_STEP'; payload: WorkflowStep }
  | { type: 'UPDATE_SESSION'; payload: Partial<SessionData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TIMESTAMP'; payload: { key: keyof SessionData['timestamps']; value: Date } }
  | { type: 'UPDATE_MEAL_DATA'; payload: Partial<SessionData['mealData']> }
  | { type: 'RESET_SESSION' };

const initialState: ServiceSyncState = {
  currentStep: 'login',
  sessionData: {
    sessionId: '',
    hostessId: 'H001',
    hostessName: 'Sarah Johnson',
    hospitalId: 'GH001',
    wardId: '',
    shiftTime: new Date(),
    timestamps: {},
    mealData: {
      type: 'breakfast',
      count: 12,
      served: 0
    },
    documentation: {
      comments: '',
      additionalNotes: ''
    },
    performance: {}
  },
  isLoading: false,
  error: null
};

const serviceSyncReducer = (state: ServiceSyncState, action: ServiceSyncAction): ServiceSyncState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_SESSION':
      return { 
        ...state, 
        sessionData: { ...state.sessionData, ...action.payload } 
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_TIMESTAMP':
      return {
        ...state,
        sessionData: {
          ...state.sessionData,
          timestamps: {
            ...state.sessionData.timestamps,
            [action.payload.key]: action.payload.value
          }
        }
      };
    
    case 'UPDATE_MEAL_DATA':
      return {
        ...state,
        sessionData: {
          ...state.sessionData,
          mealData: { ...state.sessionData.mealData, ...action.payload }
        }
      };
    
    case 'RESET_SESSION':
      return initialState;
    
    default:
      return state;
  }
};

const ServiceSyncContext = createContext<{
  state: ServiceSyncState;
  dispatch: React.Dispatch<ServiceSyncAction>;
} | undefined>(undefined);

export const ServiceSyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(serviceSyncReducer, initialState);

  return (
    <ServiceSyncContext.Provider value={{ state, dispatch }}>
      {children}
    </ServiceSyncContext.Provider>
  );
};

export const useServiceSync = () => {
  const context = useContext(ServiceSyncContext);
  if (context === undefined) {
    throw new Error('useServiceSync must be used within a ServiceSyncProvider');
  }
  return context;
};