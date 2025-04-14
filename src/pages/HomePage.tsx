
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import MedicationReminder from '@/components/MedicationReminder';
import AppointmentCard from '@/components/AppointmentCard';
import LocationTracker from '@/components/LocationTracker';
import { getAppointments, confirmAppointment, Appointment } from '@/utils/appointmentUtils';
import { toast } from 'sonner';

const HomePage = () => {
  // Sample user data
  const user = {
    name: "Maria Silva",
  };
  
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  
  // Fetch the next appointment on component mount
  useEffect(() => {
    loadNextAppointment();
  }, []);
  
  // Load the next upcoming appointment
  const loadNextAppointment = () => {
    const appointments = getAppointments();
    
    // Filter for upcoming appointments only
    const upcomingAppointments = appointments.filter(app => {
      const appointmentDate = new Date(`${app.date}T${app.time}`);
      return appointmentDate >= new Date();
    });
    
    // Sort by date (earliest first) and get the first one
    if (upcomingAppointments.length > 0) {
      const sortedAppointments = upcomingAppointments.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      setNextAppointment(sortedAppointments[0]);
    } else {
      setNextAppointment(null);
    }
  };
  
  // Handle confirming appointment
  const handleConfirmAppointment = (id: number) => {
    const success = confirmAppointment(id);
    
    if (success) {
      toast.success("Presença confirmada com sucesso!");
      loadNextAppointment(); // Refresh appointment data
    } else {
      toast.error("Erro ao confirmar presença. Tente novamente.");
    }
  };
  
  // Handle reschedule click (redirect to appointments page)
  const handleRescheduleClick = (appointment: Appointment) => {
    // For now we'll just navigate to the appointments page
    window.location.href = '/dashboard/appointments';
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
          <AppointmentCard 
            appointment={nextAppointment}
            onReschedule={handleRescheduleClick}
            onConfirm={handleConfirmAppointment}
          />
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
