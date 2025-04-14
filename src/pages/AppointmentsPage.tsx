
import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AppointmentCard from '@/components/AppointmentCard';
import AppointmentsList from '@/components/AppointmentsList';
import AppointmentScheduler from '@/components/AppointmentScheduler';
import { Appointment, getAppointments, confirmAppointment } from '@/utils/appointmentUtils';
import { toast } from 'sonner';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Fetch appointments on mount and when they change
  useEffect(() => {
    loadAppointments();
  }, []);
  
  // Load appointments from localStorage
  const loadAppointments = () => {
    const loadedAppointments = getAppointments();
    setAppointments(loadedAppointments);
  };
  
  // Filter appointments by status (upcoming or past)
  const upcomingAppointments = appointments.filter(app => {
    const appointmentDate = new Date(`${app.date}T${app.time}`);
    return appointmentDate >= new Date();
  });
  
  const pastAppointments = appointments.filter(app => {
    const appointmentDate = new Date(`${app.date}T${app.time}`);
    return appointmentDate < new Date();
  });
  
  // Get the next appointment
  const nextAppointment = upcomingAppointments.length > 0 
    ? upcomingAppointments.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })[0]
    : null;

  // Handle confirming appointment from card
  const handleConfirmAppointment = (id: number) => {
    const success = confirmAppointment(id);
    
    if (success) {
      toast.success("Presença confirmada com sucesso!");
      loadAppointments();
    } else {
      toast.error("Erro ao confirmar presença. Tente novamente.");
    }
  };

  // Handle rescheduling from card
  const handleRescheduleClick = (appointment: Appointment) => {
    // We'll reuse the same scheduler with different initial values in the future
    // For now, just open the reschedule dialog in the list
    setActiveTab("upcoming");
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Consultas</h1>
          <p className="text-gray-500">Gerencie suas consultas médicas</p>
        </div>
        <Button 
          onClick={() => setIsSchedulerOpen(true)}
          className="bg-care-purple hover:bg-care-light-purple"
        >
          <Plus className="mr-2 h-5 w-5" />
          Nova Consulta
        </Button>
      </div>
      
      {/* Show next appointment card if available */}
      <div className="mb-6">
        <AppointmentCard 
          appointment={nextAppointment}
          onReschedule={handleRescheduleClick}
          onConfirm={handleConfirmAppointment}
        />
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid grid-cols-2 w-full">
          <TabsTrigger value="upcoming" className="text-senior">
            <Calendar className="mr-2 h-5 w-5" />
            Próximas
          </TabsTrigger>
          <TabsTrigger value="past" className="text-senior">
            <Calendar className="mr-2 h-5 w-5" />
            Passadas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-0">
          <AppointmentsList 
            appointments={upcomingAppointments} 
            onUpdate={loadAppointments} 
          />
        </TabsContent>
        
        <TabsContent value="past" className="mt-0">
          <AppointmentsList 
            appointments={pastAppointments} 
            onUpdate={loadAppointments} 
          />
        </TabsContent>
      </Tabs>
      
      {/* Appointment Scheduler Dialog */}
      <AppointmentScheduler
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        onScheduled={loadAppointments}
      />
    </div>
  );
};

export default AppointmentsPage;
