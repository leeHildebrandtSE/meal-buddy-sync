import React from 'react';
import { useServiceSync } from '@/contexts/ServiceSyncContext';
import { HostessLogin } from '@/pages/HostessLogin';
import { KitchenScan } from '@/pages/KitchenScan';
import { WardArrival } from '@/pages/WardArrival';
import { DietSheet } from '@/pages/DietSheet';
import { NurseAlert } from '@/pages/NurseAlert';
import { ServiceComplete } from '@/pages/ServiceComplete';

export const ServiceSyncApp: React.FC = () => {
  const { state } = useServiceSync();

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'login':
        return <HostessLogin />;
      case 'kitchen-scan':
        return <KitchenScan />;
      case 'ward-arrival':
        return <WardArrival />;
      case 'diet-sheet':
        return <DietSheet />;
      case 'nurse-alert':
        return <NurseAlert />;
      case 'completion':
        return <ServiceComplete />;
      default:
        return <HostessLogin />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {renderCurrentStep()}
    </div>
  );
};