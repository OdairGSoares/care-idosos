
import React from 'react';
import EmptyPage from '@/components/EmptyPage';
import { Calendar } from 'lucide-react';

const AppointmentsPage = () => {
  return (
    <EmptyPage
      title="Consultas"
      description="Aqui você poderá agendar, visualizar e gerenciar suas consultas médicas."
      icon={<Calendar className="w-10 h-10" />}
    />
  );
};

export default AppointmentsPage;
