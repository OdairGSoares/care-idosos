
import React from 'react';
import EmptyPage from '@/components/EmptyPage';
import { Phone } from 'lucide-react';

const EmergencyContactsPage = () => {
  return (
    <EmptyPage
      title="Contatos de Emergência"
      description="Aqui você poderá gerenciar seus contatos para situações de emergência."
      icon={<Phone className="w-10 h-10" />}
    />
  );
};

export default EmergencyContactsPage;
