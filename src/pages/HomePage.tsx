
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import MedicationReminder from '@/components/MedicationReminder';
import AppointmentCard from '@/components/AppointmentCard';
import LocationTracker from '@/components/LocationTracker';

const HomePage = () => {
  // Sample user data
  const user = {
    name: "Maria Silva",
  };

  return (
    <div className="care-container py-6">
      <div className="mb-8 flex items-center">
        <div className="w-16 h-16 rounded-full bg-care-light-purple text-white flex items-center justify-center">
          <User className="h-8 w-8" />
        </div>
        <div className="ml-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Olá, {user.name}</h1>
          <p className="text-gray-500 text-senior">Bem-vinda ao Care Idosos</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MedicationReminder />
        <div className="space-y-6">
          <AppointmentCard />
          <LocationTracker />
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Button className="bg-care-purple hover:bg-care-light-purple h-16 text-senior" size="lg">
          Agendar Consulta
        </Button>
        <Button className="bg-care-teal hover:bg-care-dark-teal h-16 text-senior" size="lg">
          Pedir Medicamentos
        </Button>
        <Button className="bg-care-light-purple hover:bg-care-purple h-16 text-senior" size="lg">
          Serviços de Saúde
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
