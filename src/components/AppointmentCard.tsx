
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const nextAppointment = {
  doctor: "Dra. Maria Silva",
  specialty: "Cardiologista",
  date: new Date(Date.now() + 86400000 * 3), // 3 days from now
  time: "14:30",
  location: "Clínica Saúde Total",
  address: "Av. Paulista, 1000 - São Paulo"
};

const AppointmentCard = () => {
  const timeUntilAppointment = formatDistanceToNow(nextAppointment.date, { 
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
            <h3 className="text-senior-lg font-medium">{nextAppointment.doctor}</h3>
            <p className="text-gray-500">{nextAppointment.specialty}</p>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-care-purple mr-2" />
            <div>
              <p className="text-senior font-medium">
                {nextAppointment.date.toLocaleDateString('pt-BR')}
                <span className="text-care-purple ml-2">({timeUntilAppointment})</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-care-purple mr-2" />
            <p className="text-senior">{nextAppointment.time}</p>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-care-purple mr-2 mt-1" />
            <div>
              <p className="text-senior font-medium">{nextAppointment.location}</p>
              <p className="text-gray-500">{nextAppointment.address}</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              className="flex-1 border-care-purple text-care-purple hover:bg-care-light-purple/20"
            >
              Reagendar
            </Button>
            <Button 
              className="flex-1 bg-care-purple hover:bg-care-light-purple"
            >
              Confirmar Presença
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
