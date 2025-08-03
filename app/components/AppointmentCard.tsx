
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, CalendarX } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/utils/appointmentUtils';

interface AppointmentCardProps {
  appointment: Appointment | null;
  onReschedule?: (appointment: Appointment) => void;
  onConfirm?: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment,
  onReschedule,
  onConfirm
}) => {
  if (!appointment) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-care-purple text-white rounded-t-lg">
                  <CardTitle className="text-white flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Próxima Consulta
        </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex flex-col items-center justify-center py-6">
            <CalendarX className="h-16 w-16 text-care-purple mb-3" />
            <h3 className="text-xl font-medium text-care-purple mb-2">Nenhuma consulta agendada</h3>
            <p className="text-care-purple mb-4 text-center">
              Você ainda não possui consultas agendadas. Clique no botão abaixo para agendar uma nova consulta.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Corrigir parse da data que vem no formato YYYY-MM-DD da API
  let appointmentDate: Date;
  let timeUntilAppointment: string;
  
  try {
    // A data vem da API no formato YYYY-MM-DD
    // Vamos parseá-la como data local para evitar problemas de timezone
    const dateStr = appointment.date;
    const [year, month, day] = dateStr.split('-');
    appointmentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    timeUntilAppointment = formatDistanceToNow(appointmentDate, { 
      addSuffix: true,
      locale: ptBR
    });
  } catch (error) {
    console.warn('Erro ao formatar data no AppointmentCard:', appointment.date, error);
    appointmentDate = new Date(); // Fallback
    timeUntilAppointment = 'Data inválida';
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-care-purple text-white rounded-t-lg">
        <CardTitle className="text-white flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Próxima Consulta
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-care-purple">{appointment.doctorName}</h3>
                            <p className="text-care-purple">{appointment.specialty}</p>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-care-purple mr-2" />
            <div>
              <p className="text-care-purple">
                {appointmentDate.toLocaleDateString('pt-BR')}
                <span className="text-care-purple ml-1">({timeUntilAppointment})</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-care-purple mr-2" />
            <p className="text-care-purple">{appointment.time}</p>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-care-purple mr-2 mt-1" />
            <div>
              <p className="text-care-purple font-medium">{appointment.locationName} - {appointment.locationAddress}</p>
            </div>
          </div>

          {appointment.confirmed && (
            <div className="flex items-center justify-center p-2 bg-green-100 text-green-600 rounded-md">
              <span>Presença Confirmada</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
