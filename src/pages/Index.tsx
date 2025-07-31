import React from 'react';
import { ServiceSyncProvider } from '@/contexts/ServiceSyncContext';
import { ServiceSyncApp } from '@/components/ServiceSyncApp';

const Index = () => {
  return (
    <ServiceSyncProvider>
      <ServiceSyncApp />
    </ServiceSyncProvider>
  );
};

export default Index;
