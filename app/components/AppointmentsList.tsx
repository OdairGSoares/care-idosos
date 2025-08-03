import React, { useState } from 'react';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Check, Calendar as CalendarIcon, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar as UICalendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Appointment, 
  getAvailableTimeSlots, 
  rescheduleAppointment, 
  confirmAppointment,
  cancelAppointment,
  deleteAppointment
} from '@/utils/appointmentUtils';

import axios from 'axios';

interface AppointmentsListProps {
  appointments: Appointment[];
  onUpdate: () => void;
  isPast?: boolean; // Indica se as consultas são passadas
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments, onUpdate, isPast = false }) => {
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string>("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ id: number, time: string, available: boolean }[]>([]);
  
  // Handle opening the reschedule dialog
  const handleRescheduleClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleDialogOpen(true);
    
    // Set initial date to the current appointment date (formato YYYY-MM-DD da API)
    try {
      const dateStr = appointment.date;
      const [year, month, day] = dateStr.split('-');
      const appointmentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      setNewDate(appointmentDate);
      
      // Get available time slots for this date
      const timeSlots = getAvailableTimeSlots(appointmentDate);
      setAvailableTimeSlots(timeSlots);
    } catch (error) {
      console.warn('Erro ao processar data da consulta:', appointment.date, error);
      setNewDate(new Date());
      setAvailableTimeSlots([]);
    }
  };

  // Handle opening the cancel dialog
  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };
  
  // Handle date selection for rescheduling
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setNewDate(date);
      
      // Get available time slots for this date
      const slots = getAvailableTimeSlots(date);
      setAvailableTimeSlots(slots);
      setNewTime(""); // Reset time selection
    }
  };
  
  // Handle rescheduling confirmation
  const handleRescheduleConfirm = () => {
    if (!selectedAppointment || !newDate || !newTime) {
      toast.error("Por favor, selecione uma nova data e horário.");
      return;
    }
    
    const formattedDate = format(newDate, 'yyyy-MM-dd');
    
    async function RescheduleAppointment() {

      if (!selectedAppointment?.id) {
        toast.error("Erro ao identificar a consulta.");
        return;
      }

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token de autenticação não encontrado.');
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      const payload = {
        time: String(newTime),
        doctorId: String(selectedAppointment.doctorId),
        locationId: String(selectedAppointment.locationId),
        date: String(formattedDate),
        createdAt: String(Date.now()),
      }

      console.log('📋 Reagendando consulta:', payload)

      try {
        const response = await axios.put(
          `/api/appointments/${selectedAppointment.id}`, payload,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        
        if (response.status === 200) {
          console.log('✅ Consulta reagendada com sucesso');
          toast.success("Consulta reagendada com sucesso!");
          setRescheduleDialogOpen(false);
          
          // Atualizar lista de consultas apenas em caso de sucesso
          console.log('🔄 Atualizando lista de consultas...');
          onUpdate();
        } else {
          toast.error("Erro inesperado ao reagendar consulta.");
        }
      } catch (error) {
        console.error('❌ Erro ao reagendar consulta:', error);
        toast.error("Erro ao reagendar consulta. Tente novamente.");
        setRescheduleDialogOpen(false);
        
        // Não atualizar em caso de erro, mas fechar o dialog
      } 
    }
    
    RescheduleAppointment();

  };

  // Handle appointment cancellation
  const handleCancelConfirm = () => {

    async function deleteAppointment() {

      if (!selectedAppointment) {
        toast.error("Erro ao identificar a consulta.");
        return;
      }

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token de autenticação não encontrado.');
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      try {
        console.log('🗑️ Cancelando consulta:', selectedAppointment.id);
        
        const response = await axios.delete(
          `/api/appointments/${selectedAppointment.id}`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        
        if (response.status === 200) {
          console.log('✅ Consulta cancelada com sucesso');
          toast.success('Consulta cancelada com sucesso!');
          setCancelDialogOpen(false);
          
          // Atualizar lista de consultas apenas em caso de sucesso
          console.log('🔄 Atualizando lista de consultas...');
          onUpdate();
        } else {
          toast.error('Erro inesperado ao cancelar consulta.');
          setCancelDialogOpen(false);
        }
      } catch (error) {
        console.error('❌ Erro ao cancelar consulta:', error);
        toast.error('Erro ao remover consulta.');
        setCancelDialogOpen(false);
        
        // Não atualizar em caso de erro, mas fechar o dialog
      } 
    }

    deleteAppointment();
  };
  
  // Handle appointment confirmation
  const handleConfirmAppointment = (id: string) => {
    async function confirmAppointment() {

      if (!id) {
        toast.error("Erro ao identificar a consulta.");
        return;
      }

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token de autenticação não encontrado.');
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      try {
        console.log('✅ Confirmando presença da consulta:', id);
        
        const response = await axios.put(
          `/api/appointments/confirmed/${id}`,
          {confirmed: true},
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        
        if (response.status === 200) {
          console.log('✅ Presença confirmada com sucesso');
          toast.success('Presença confirmada com sucesso!');
          
          // Atualizar lista de consultas apenas em caso de sucesso
          console.log('🔄 Atualizando lista de consultas...');
          onUpdate();
        } else {
          toast.error('Erro inesperado ao confirmar presença.');
        }
      } catch (error) {
        console.error('❌ Erro ao confirmar consulta:', error);
        toast.error('Erro ao confirmar consulta.');
        
        // Não atualizar em caso de erro
      } 
    }
    
    confirmAppointment();
  };
  
  // Sort appointments by date (most recent first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    try {
      // A data vem da API no formato YYYY-MM-DD
      // Parseá-la como data local para evitar problemas de timezone
      const [yearA, monthA, dayA] = a.date.split('-').map(num => parseInt(num));
      const [yearB, monthB, dayB] = b.date.split('-').map(num => parseInt(num));
      
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      
      // Ordenar por data primeiro, depois por horário
      if (a.date !== b.date) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.time.localeCompare(b.time);
    } catch (error) {
      console.warn('Erro ao ordenar consultas:', error);
      return 0;
    }
  });
  
  return (
    <div className="space-y-4">
      {sortedAppointments.length > 0 ? (
        sortedAppointments.map(appointment => (
          <div 
            key={appointment.id}
            className={`border rounded-lg p-5 ${
              appointment.confirmed ? 'bg-green-50 border-green-200' : 'bg-white'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-care-purple">{appointment.doctorName}</h4>
                  <p className="text-care-purple">{appointment.specialty}</p>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-care-purple mr-2" />
                  <p className="text-care-purple">
                    {(() => {
                      try {
                        // A data vem da API no formato YYYY-MM-DD
                        // Vamos parseá-la como data local para evitar problemas de timezone
                        const dateStr = appointment.date;
                        const [year, month, day] = dateStr.split('-');
                        const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        
                        return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
                      } catch (error) {
                        console.warn('Erro ao formatar data:', appointment.date, error);
                        return appointment.date; // Fallback para a data original
                      }
                    })()}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-care-purple mr-2" />
                  <p className="text-care-purple">
                    {(() => {
                      const timeStr = appointment.time?.padStart(5, '0'); // força formato HH:mm
                      const fullTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
                      const dateObj = new Date(`2000-01-01T${fullTime}`);

                      return isNaN(dateObj.getTime())
                        ? 'Horário inválido'
                        : format(dateObj, 'HH:mm', { locale: ptBR });
                    })()}
                  </p>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-care-purple mr-2 mt-1" />
                  <div>
                    <p className="text-care-purple font-medium">{appointment.locationName} - {appointment.locationAddress}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {!isPast ? (
                  // Botões apenas para consultas futuras
                  <>
                    {!appointment.confirmed ? (
                      <>
                        <Button
                          variant="outline"
                          className="border-care-purple text-care-purple hover:bg-care-light-purple/20 hover:text-care-purple"
                          onClick={() => handleRescheduleClick(appointment)}
                        >
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Reagendar
                        </Button>
                        <Button
                          className="bg-care-purple hover:bg-care-light-purple"
                          onClick={() => handleConfirmAppointment(appointment.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Confirmar Presença
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleCancelClick(appointment)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center p-2 bg-green-100 text-green-600 rounded-md">
                          <Check className="h-5 w-5 mr-2" />
                          <span>Presença Confirmada</span>
                        </div>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleCancelClick(appointment)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  // Para consultas passadas, mostrar apenas status
                  <>
                    {appointment.confirmed ? (
                      <div className="flex items-center justify-center p-2 bg-green-100 text-green-600 rounded-md">
                        <Check className="h-5 w-5 mr-2" />
                        <span>Presença Confirmada</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-md">
                        <span>Consulta Realizada</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <CalendarIcon className="h-12 w-12 mx-auto text-care-purple mb-3" />
          <h3 className="text-xl font-medium text-care-purple mb-2">Nenhuma consulta agendada</h3>
          <p className="text-care-purple mb-4">
            Você ainda não possui consultas agendadas. Clique no botão abaixo para agendar uma nova consulta.
          </p>
        </div>
      )}
      
      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-care-purple">Reagendar Consulta</DialogTitle>
            <DialogDescription>
              Selecione uma nova data e horário para sua consulta.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-care-purple">Nova Data</label>
              <UICalendar
                mode="single"
                selected={newDate}
                onSelect={handleDateSelect}
                disabled={(date) => 
                  date < new Date() || // Disable past dates
                  date.getDay() === 0 || // Disable Sundays
                  date.getDay() === 6    // Disable Saturdays
                }
                locale={ptBR}
                className="border rounded-md p-3 pointer-events-auto"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-care-purple">Novo Horário</label>
              <Select 
                onValueChange={setNewTime}
                value={newTime}
                disabled={!newDate}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots
                    .filter(slot => slot.available)
                    .map((slot) => (
                      <SelectItem key={slot.id} value={slot.time}>
                        {slot.time}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {availableTimeSlots.length > 0 && availableTimeSlots.filter(slot => slot.available).length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Não há horários disponíveis para esta data. Por favor, selecione outra data.
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setRescheduleDialogOpen(false)}
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleRescheduleConfirm}
              className="bg-care-purple hover:bg-care-light-purple"
              disabled={!newDate || !newTime}
            >
              <Check className="h-4 w-4 mr-1" />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-care-purple">Cancelar Consulta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta consulta? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelConfirm}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentsList;
