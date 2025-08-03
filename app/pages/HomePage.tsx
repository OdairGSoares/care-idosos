import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User } from 'lucide-react';
import MedicationReminder from '@/components/MedicationReminder';
import AppointmentCard from '@/components/AppointmentCard';
import LocationTracker from '@/components/LocationTracker';
import { getAppointments, confirmAppointment, Appointment } from '@/utils/appointmentUtils';
import { toast } from 'sonner';

const HomePage = () => {
  type Usuario = {
    id: string;
    userFirstName: string;
    userLastName: string;
    email: string;
    locationPermission?: boolean;
  } | null;

  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      if (!authToken || !userId) {
        toast.error('Dados de autenticação não encontrados.');
        return;
      }

      try {
        // Usar nossa API local do Next.js
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário');
        }

        const userInfo = await response.json();
        console.log('Dados do usuário:', userInfo);

        setUsuario(userInfo);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        toast.error('Erro ao carregar dados do usuário');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (usuario) {
      loadData();
    }
  }, [usuario]);

  const loadData = async () => {
    const authToken = localStorage.getItem('authToken');
  
    if (!authToken) {
      toast.error('Token não encontrado.');
      return;
    }
  
    try {
      // Usar nossa API local do Next.js para appointments
      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar appointments');
      }

      const appointmentsData = await response.json();
      console.log('📋 Dados brutos da API:', appointmentsData);
      
      // Mapear dados da API para formato esperado pelos componentes (mesmo mapeamento da AppointmentsPage)
      const mappedAppointments = appointmentsData.map((app: any) => ({
        ...app,
        // Campos flat para compatibilidade com componentes
        doctorName: app.doctor?.doctorName || app.doctorName,
        specialty: app.doctor?.specialty || app.specialty,
        locationName: app.location?.locationName || app.locationName,
        locationAddress: app.location?.locationAddress || app.locationAddress,
        locationCity: app.location?.locationCity || app.locationCity
      }));
      
      console.log('✅ Dados mapeados:', mappedAppointments);
      
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutos desde 00:00
      
      let nextAppointment = null;
      let closestTimeDiff = Infinity;
  
      for (const app of mappedAppointments) {
        try {
          // A data vem da API no formato YYYY-MM-DD
          const appointmentDate = app.date;
          const [hours, minutes] = app.time.split(':').map(Number);
          const appointmentTime = hours * 60 + minutes;
          
          // Verificar se é uma consulta futura
          const isFuture = appointmentDate > today || (appointmentDate === today && appointmentTime > currentTime);
          
          if (isFuture) {
            // Calcular diferença em tempo para encontrar a mais próxima
            const appointmentDateTime = new Date(`${appointmentDate}T${app.time}:00`);
            const diff = appointmentDateTime.getTime() - now.getTime();
            
            if (diff < closestTimeDiff) {
              closestTimeDiff = diff;
              nextAppointment = app;
            }
          }
        } catch (error) {
          console.warn(`Erro ao processar agendamento: ${app.date} ${app.time}`, error);
        }
      }
  
      console.log('🎯 Próxima consulta encontrada:', nextAppointment);
      setNextAppointment(nextAppointment);
      
    } catch (error) {
      console.error('❌ Erro ao carregar consultas:', error);
      toast.error("Erro ao carregar próxima consulta");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirming appointment
  const handleConfirmAppointment = async (id: string) => {
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
    window.location.href = '/dashboard/appointments';
  };

  if (isLoading) {
    return (
      <div className="care-container py-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-care-teal"></div>
          <span className="ml-2 text-gray-600">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="care-container py-6">
      <div className="mb-8 mt-4 flex items-center">
      <div className="mr-4 rounded-full bg-care-purple/10 p-2">
            <User className="h-6 w-6 sm:h-16 sm:w-16 text-care-purple" />
          </div>
        <div className="ml-4 text-care-purple">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Olá, {usuario?.userFirstName || 'Usuário'}
          </h1>
          <p className="text-senior text-care-purple">Bem-vindo ao Care Idosos</p>
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
        <Link href="/dashboard/appointments">
          <Button className="hover:bg-care-teal bg-care-dark-teal h-16 text-white w-full" size="lg">
            Agendar Consulta
          </Button>
        </Link>
        <Link href="/dashboard/profile">
          <Button className="hover:bg-care-light-purple bg-care-purple h-16 w-full text-white" size="lg">
            Serviços de Saúde
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
