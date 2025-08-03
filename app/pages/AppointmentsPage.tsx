
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

  // Auto-refresh appointments every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-atualizando consultas...');
      loadAppointments();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  // Load appointments from API
  const loadAppointments = async () => {
    console.log('🔄 [AppointmentsPage] Iniciando carregamento de consultas...');
    
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
      console.log('❌ [AppointmentsPage] Sessão não encontrada');
      toast.error('Sessão não encontrada. Faça login novamente.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔍 [AppointmentsPage] Fazendo requisição para API...');
      
      const response = await axios.get('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.log('❌ [AppointmentsPage] Token expirado');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }
    
      const appointmentsData = response.data;
      console.log('✅ [AppointmentsPage] Consultas recebidas da API:', appointmentsData.length);
      
      // Mapear dados da API para formato esperado pelos componentes
      const mappedAppointments = appointmentsData.map((app: any) => ({
        ...app,
        // Campos flat para compatibilidade com componentes
        doctorName: app.doctor?.doctorName || app.doctorName,
        specialty: app.doctor?.specialty || app.specialty,
        locationName: app.location?.locationName || app.locationName,
        locationAddress: app.location?.locationAddress || app.locationAddress,
        locationCity: app.location?.locationCity || app.locationCity
      }));
      
      console.log('🔄 [AppointmentsPage] Dados mapeados:', mappedAppointments.length);
      setAppointments(mappedAppointments);
      
      // Separar consultas por data e horário
      const now = new Date();
      const currentTimestamp = now.getTime();
      
      const upcoming: Appointment[] = [];
      const past: Appointment[] = [];
      
      mappedAppointments.forEach((app: Appointment) => {
        try {
          // Criar timestamp da consulta combinando data e horário
          const appointmentDate = app.date; // Formato YYYY-MM-DD
          const appointmentTime = app.time; // Formato HH:mm
          
          // Criar objeto Date da consulta
          const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
          const appointmentTimestamp = appointmentDateTime.getTime();
          
          // Comparar timestamps completos
          if (appointmentTimestamp > currentTimestamp) {
            upcoming.push(app);
          } else {
            past.push(app);
          }
        } catch (error) {
          console.warn(`Erro ao processar consulta ${app.id}:`, error);
          // Em caso de erro, colocar nas passadas por segurança
          past.push(app);
        }
      });
      
      console.log('📅 [AppointmentsPage] Consultas futuras:', upcoming.length);
      console.log('📅 [AppointmentsPage] Consultas passadas:', past.length);

      setUpcomingAppointments(upcoming);
      setPastAppointments(past);

    } catch (error: unknown) {
      console.error('❌ [AppointmentsPage] Erro ao carregar consultas:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          toast.error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 404) {
          toast.error('Nenhuma consulta encontrada.');
        } else if (error.response && error.response.status >= 500) {
          toast.error('Erro no servidor. Tente novamente mais tarde.');
        } else {
          toast.error('Erro ao carregar consultas.');
        }
      } else {
        toast.error("Erro de conexão ao carregar consultas");
      }
    } finally {
      console.log('🏁 [AppointmentsPage] Carregamento finalizado');
      setIsLoading(false);
    }
  };

  // Get the next appointment
  const nextAppointment = upcomingAppointments.length > 0
    ? upcomingAppointments.sort((a, b) => {
      // Ordenar por data primeiro, depois por horário
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.time.localeCompare(b.time);
    })[0]
    : null;

  // Handle confirming appointment from card
  const handleConfirmAppointment = async (id: string) => {
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      toast.error('Sessão não encontrada. Faça login novamente.');
      return;
    }

    try {
      console.log('✅ Confirmando presença para consulta:', id);
      
      const response = await axios.put(`/api/appointments/confirmed/${id}`, 
        { confirmed: true },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        toast.success("Presença confirmada com sucesso!");
        await loadAppointments();
      } else {
        toast.error("Erro ao confirmar presença. Tente novamente.");
      }
    } catch (error: unknown) {
      console.error("❌ Erro ao confirmar presença:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          toast.error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 404) {
          toast.error('Consulta não encontrada.');
        } else {
          toast.error('Erro ao confirmar presença. Tente novamente.');
        }
      } else {
        toast.error("Erro de conexão ao confirmar presença");
      }
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
          <h1 className="text-2xl font-bold mb-1 text-care-purple">Consultas</h1>
          <p className="text-care-purple">Gerencie suas consultas médicas</p>
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
          <TabsTrigger value="upcoming" className="text-care-purple">
            <Calendar className="mr-2 h-5 w-5" />
            Próximas
          </TabsTrigger>
          <TabsTrigger value="past" className="text-care-purple">
            <Calendar className="mr-2 h-5 w-5" />
            Passadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-white rounded-lg border border-gray-200 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 w-24 bg-gray-200 rounded" />
                      <div className="h-8 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-care-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-care-purple" />
              </div>
              <h3 className="text-lg font-medium text-care-purple mb-2">
                Nenhuma consulta agendada
              </h3>
              <p className="text-care-purple mb-6 max-w-sm mx-auto">
                Você não tem consultas próximas. Agende uma nova consulta para começar a cuidar da sua saúde.
              </p>
              <Button
                onClick={() => setIsSchedulerOpen(true)}
                className="bg-care-purple hover:bg-care-light-purple"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agendar Consulta
              </Button>
            </div>
          ) : (
            <AppointmentsList
              appointments={upcomingAppointments}
              onUpdate={loadAppointments}
              isPast={false}
            />
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-6 bg-white rounded-lg border border-gray-200 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : pastAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-care-purple" />
              </div>
              <h3 className="text-lg font-medium text-care-purple mb-2">
                Nenhuma consulta anterior
              </h3>
              <p className="text-care-purple max-w-sm mx-auto">
                Suas consultas passadas aparecerão aqui após serem realizadas.
              </p>
            </div>
          ) : (
            <AppointmentsList
              appointments={pastAppointments}
              onUpdate={loadAppointments}
              isPast={true}
            />
          )}
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
