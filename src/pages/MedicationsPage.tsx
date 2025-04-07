
import React from 'react';
import EmptyPage from '@/components/EmptyPage';
import { Pill } from 'lucide-react';

const MedicationsPage = () => {
  return (
    <EmptyPage
      title="Medicamentos"
      description="Aqui você poderá gerenciar seus medicamentos, horários e receber lembretes."
      icon={<Pill className="w-10 h-10" />}
    />
  );
};

export default MedicationsPage;
