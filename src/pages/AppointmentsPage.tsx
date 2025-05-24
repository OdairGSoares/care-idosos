
import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AppointmentCard from '@/components/AppointmentCard';
import AppointmentsList from '@/components/AppointmentsList';
import AppointmentScheduler from '@/components/AppointmentScheduler';
import { Appointment, getAppointments, confirmAppointment } from '@/utils/appointmentUtils';
import { toast } from 'sonner';
import axios from 'axios';
import { format } from 'date-fns';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch appointments on mount and when they change
  useEffect(() => {
    loadAppointments();
  }, []);

  // Load appointments from API
  useEffect(() => {
    loadAppointments();
  }, []);

  // Load appointments from API
  const loadAppointments = async () => {

    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      toast.error('Token não encontrado.');
      return;
    }

    try {
      const response = await axios.get('https://elderly-care.onrender.com/appointment', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    
      const appointments = response.data;
      setAppointments(appointments);
      
      const now = new Date();

      function parseDateTime(dateStr: string, timeStr: string): Date {
        try {
          if (!dateStr || !timeStr) throw new Error("Data ou hora ausente");
      
          let [day, month, year] = [null, null, null];
      
          if (dateStr.includes('/')) {
            [day, month, year] = dateStr.split('/');
          } else if (dateStr.includes('-')) {
            [year, month, day] = dateStr.split('-');
          } else {
            throw new Error("Formato de data inválido");
          }
      
          // Normaliza a hora para HH:mm
          let [hour, minute] = timeStr.split(':');
          hour = hour.padStart(2, '0');
          minute = minute.padStart(2, '0');
      
          const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour}:${minute}:00`;
          const parsed = new Date(isoString);
      
          if (isNaN(parsed.getTime())) throw new Error("Data inválida");
      
          return parsed;
        } catch (err) {
          console.error("Erro ao processar data/hora:", { dateStr, timeStr, err });
          return new Date("Invalid Date");
        }
      }

      appointments.forEach(app => {
        const date = parseDateTime(app.date, app.time);
        console.log(app.id, '->', date.toString());
      });
      

      // Garante precisão até os segundos e normaliza para comparação
      const normalizedNow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
      
      const upcoming: Appointment[] = [];
      const past: Appointment[] = [];
      
      appointments.forEach(app => {
        const appointmentDate = parseDateTime(app.date, app.time);
        if (isNaN(appointmentDate.getTime())) {
          console.warn(`Data inválida para o agendamento ${app.id}`);
          return; // ignora esse item
        }
      
        if (appointmentDate.getTime() >= normalizedNow.getTime()) {
          upcoming.push(app);
        } else {
          past.push(app);
        }
      });
      
    
      console.log(upcoming)

      setUpcomingAppointments(upcoming);
      setPastAppointments(past);

    } catch (error) {
      toast.error("Erro ao carregar consultas");
    } finally {
      setIsLoading(false);
    }

  };

  // Get the next appointment
  const nextAppointment = upcomingAppointments.length > 0
    ? upcomingAppointments.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })[0]
    : null;

  // Handle confirming appointment from card
  const handleConfirmAppointment = async (id: number) => {
    try {
      const success = await confirmAppointment(id);

      if (success) {
        toast.success("Presença confirmada com sucesso!");
        await loadAppointments();
      } else {
        toast.error("Erro ao confirmar presença. Tente novamente.");
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast.error("Erro ao confirmar presença");
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
