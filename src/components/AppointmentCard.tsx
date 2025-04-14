
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
  onConfirm?: (id: number) => void;
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
          <CardTitle className="text-senior-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Próxima Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex flex-col items-center justify-center py-6">
            <CalendarX className="h-16 w-16 text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma consulta agendada</h3>
            <p className="text-gray-500 mb-4 text-center">
              Você ainda não possui consultas agendadas. Clique no botão abaixo para agendar uma nova consulta.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const appointmentDate = parseISO(appointment.date);
  const timeUntilAppointment = formatDistanceToNow(appointmentDate, { 
    addSuffix: true,
    locale: ptBR
  });
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-care-purple text-white rounded-t-lg">
        <CardTitle className="text-senior-lg flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Próxima Consulta
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-senior-lg font-medium">{appointment.doctorName}</h3>
            <p className="text-gray-500">{appointment.specialty}</p>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-care-purple mr-2" />
            <div>
              <p className="text-senior font-medium">
                {appointmentDate.toLocaleDateString('pt-BR')}
                <span className="text-care-purple ml-2">({timeUntilAppointment})</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-care-purple mr-2" />
            <p className="text-senior">{appointment.time}</p>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-care-purple mr-2 mt-1" />
            <div>
              <p className="text-senior font-medium">{appointment.locationName}</p>
              <p className="text-gray-500">{appointment.locationAddress}</p>
            </div>
          </div>
          
          {!appointment.confirmed && (
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                className="flex-1 border-care-purple text-care-purple hover:bg-care-light-purple/20"
                onClick={() => onReschedule && onReschedule(appointment)}
              >
                Reagendar
              </Button>
              <Button 
                className="flex-1 bg-care-purple hover:bg-care-light-purple"
                onClick={() => onConfirm && onConfirm(appointment.id)}
              >
                Confirmar Presença
              </Button>
            </div>
          )}
          
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
