import React, { useState } from 'react';
import { toast } from 'sonner';
import { format, parseISO, addDays } from 'date-fns';
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
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments, onUpdate }) => {
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
    
    // Set initial date to the current appointment date
    const appointmentDate = parseISO(appointment.date);
    setNewDate(appointmentDate);
    
    // Get available time slots for this date
    const timeSlots = getAvailableTimeSlots(appointmentDate);
    setAvailableTimeSlots(timeSlots);
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

      if (!selectedAppointment.id) {
        toast.error("Erro ao identificar a consulta.");
        return;
      }

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token de autenticação não encontrado.');
        return;
      }

      const payload = {
        time: String(newTime),
        doctorId: String(selectedAppointment.doctorId),
        locationId: String(selectedAppointment.locationId),
        date: String(formattedDate),
        createdAt: String(Date.now()),
      }

      console.log(payload)

      try {
        await axios.put(
          `https://elderly-care.onrender.com/appointment/${selectedAppointment.id}`, payload,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        toast.success("Consulta reagendada com sucesso!");
        setRescheduleDialogOpen(false);
        onUpdate();
      } catch (error) {
        toast.error("Erro ao reagendar consulta. Tente novamente.");
        setRescheduleDialogOpen(false);
        onUpdate();
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
        return;
      }

      try {
        await axios.delete(
          `https://elderly-care.onrender.com/appointment/${selectedAppointment.id}`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        toast.success('Consulta cancelada com sucesso!');
      } catch (error) {
        toast.error('Erro ao remover consulta.');
      } 
    }

    deleteAppointment();
    setCancelDialogOpen(false);
    onUpdate();
  };
  
  // Handle appointment confirmation
  const handleConfirmAppointment = (id: number) => {
    async function confirmAppointment() {

      if (!id) {
        toast.error("Erro ao identificar a consulta.");
        return;
      }

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token de autenticação não encontrado.');
        return;
      }

      try {
        await axios.put(
          `https://elderly-care.onrender.com/appointment/confirmed/${id}`,
          {confirmed: true},
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        toast.success('Presença confirmada com sucesso!');
        onUpdate();
      } catch (error) {
        toast.error('Erro ao confirmar consulta.');
      } 
    }
    
    confirmAppointment();
  };
  
  // Sort appointments by date (most recent first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return dateA.getTime() - dateB.getTime();
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
                  <h3 className="text-senior-lg font-medium">{appointment.doctorName}</h3>
                  <p className="text-gray-500">{appointment.specialty}</p>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-care-purple mr-2" />
                  <p className="text-senior">
                  {format(addDays(new Date(appointment.date.split('/').reverse().join('-')), 1), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-care-purple mr-2" />
                  <p className="text-senior">{format(new Date(`2000-01-01T${appointment.time}`), 'HH:mm', { locale: ptBR })}</p>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-care-purple mr-2 mt-1" />
                  <div>
                    <p className="text-senior font-medium">{appointment.locationName}</p>
                    <p className="text-gray-500">{appointment.locationAddress}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {!appointment.confirmed ? (
                  <>
                    <Button
                      variant="outline"
                      className="border-care-purple text-care-purple hover:bg-care-light-purple/20"
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
                      className="border-red-500 text-red-500 hover:bg-red-50"
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
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma consulta agendada</h3>
          <p className="text-gray-500 mb-4">
            Você ainda não possui consultas agendadas. Clique no botão abaixo para agendar uma nova consulta.
          </p>
        </div>
      )}
      
      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reagendar Consulta</DialogTitle>
            <DialogDescription>
              Selecione uma nova data e horário para sua consulta.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nova Data</label>
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
              <label className="text-sm font-medium">Novo Horário</label>
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
            <AlertDialogTitle>Cancelar Consulta</AlertDialogTitle>
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
