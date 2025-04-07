
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const AppointmentCard = () => {
  // Sample appointment data
  const nextAppointment = {
    doctor: "Dra. Ana Silva",
    specialty: "Cardiologia",
    date: "15 de Abril, 2025",
    time: "14:30",
    location: "Hospital São Lucas - Consultório 302",
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-care-purple text-white rounded-t-lg">
        <CardTitle className="text-senior-lg flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Próxima Consulta
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-care-purple mt-0.5" />
          <div>
            <p className="font-bold text-senior">{nextAppointment.doctor}</p>
            <p className="text-gray-600">{nextAppointment.specialty}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-care-purple" />
          <p>{nextAppointment.date}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-care-purple" />
          <p>{nextAppointment.time}</p>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-care-purple mt-0.5" />
          <p>{nextAppointment.location}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button variant="outline" className="border-care-purple text-care-purple flex-1 text-senior">
            Reagendar
          </Button>
          <Button className="bg-care-purple hover:bg-care-light-purple flex-1 text-senior">
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
