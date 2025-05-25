import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import MedicationReminder from '@/components/MedicationReminder';
import AppointmentCard from '@/components/AppointmentCard';
import LocationTracker from '@/components/LocationTracker';
import { getAppointments, confirmAppointment, Appointment } from '@/utils/appointmentUtils';
import { toast } from 'sonner';
import axios from 'axios';

const HomePage = () => {

  
type Usuario = {
  token: string | null;
  info: {
    firstName: string;
  };
} | null;

  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      const userInfo = await axios.get(`https://elderly-care.onrender.com/user/${userId}`, {
        withCredentials: true,
        headers: {
          Authorization: `${authToken}`
        }
      });

      console.log(userInfo)

      setUsuario(
        {
          token: authToken,
          info: {
            firstName: userInfo.data.userFirstName,
          }
        }
      )
    };

    fetchUser();
    loadData();
  }, []);

  const loadData = async () => {
    const authToken = usuario.token
  
    if (!authToken) {
      toast.error('Token não encontrado.');
      return;
    }
  
    try {
      const response = await axios.get('https://elderly-care.onrender.com/appointment', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      const appointments = response.data;
      const now = new Date();
  
      const parseDateTime = (dateStr: string, timeStr: string): Date => {
        let day: string, month: string, year: string;
  
        if (dateStr.includes('/')) {
          [day, month, year] = dateStr.split('/');
        } else if (dateStr.includes('-')) {
          [year, month, day] = dateStr.split('-');
        } else {
          throw new Error(`Formato de data inválido: ${dateStr}`);
        }
  
        return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timeStr.padStart(5, '0')}:00`);
      };
  
      let closestAppointment = null;
      let closestTimeDiff = Infinity;
  
      for (const app of appointments) {
        try {
          const appointmentDate = parseDateTime(app.date, app.time);
          const diff = appointmentDate.getTime() - now.getTime();
  
          if (diff >= 0 && diff < closestTimeDiff) {
            closestTimeDiff = diff;
            closestAppointment = app;
          }
        } catch (e) {
          console.warn(`Erro ao processar agendamento inválido: ${app.date} ${app.time}`, e);
        }
      }
  
      setNextAppointment(closestAppointment);
      
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar próxima consulta");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirming appointment
  const handleConfirmAppointment = async (id: number) => {
    try {
      const success = await confirmAppointment(id);
      
      if (success) {
        toast.success("Presença confirmada com sucesso!");
        await loadData(); // Refresh appointment data
      } else {
        toast.error("Erro ao confirmar presença. Tente novamente.");
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast.error("Erro ao confirmar presença");
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
          <h1 className="text-2xl sm:text-3xl font-bold">
            Olá, {usuario?.info?.firstName || 'Usuário'}
          </h1>
          <p className="text-gray-500 text-senior">Bem-vindo ao Care Idosos</p>
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
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        <Link to="/dashboard/appointments">
          <Button className="bg-care-teal hover:bg-care-dark-teal h-16 text-senior w-full" size="lg">
            Agendar Consulta
          </Button>
        </Link>
        <Link to="/dashboard/profile">
        <Button className="bg-care-light-purple hover:bg-care-purple h-16 text-senior w-full text-white" size="lg">
          Serviços de Saúde
        </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
