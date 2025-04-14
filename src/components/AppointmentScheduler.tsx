
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { 
  Doctor, 
  Location, 
  TimeSlot, 
  getSpecialties, 
  getDoctorsBySpecialty, 
  locations, 
  getAvailableTimeSlots, 
  saveAppointment 
} from '@/utils/appointmentUtils';

const formSchema = z.object({
  specialty: z.string({
    required_error: "Selecione uma especialidade",
  }),
  doctorId: z.coerce.number({
    required_error: "Selecione um médico",
  }),
  locationId: z.coerce.number({
    required_error: "Selecione uma unidade de atendimento",
  }),
  date: z.date({
    required_error: "Selecione uma data para a consulta",
  }),
  timeSlotId: z.coerce.number({
    required_error: "Selecione um horário disponível",
  }),
});

interface AppointmentSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduled: () => void;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ 
  isOpen, 
  onClose,
  onScheduled
}) => {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const specialties = getSpecialties();
  
  // Handle specialty selection
  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
    const filteredDoctors = getDoctorsBySpecialty(value);
    setAvailableDoctors(filteredDoctors);
    form.setValue("specialty", value);
    
    // Reset doctor and date selections
    form.setValue("doctorId", undefined as any);
    form.resetField("date");
    setSelectedDate(undefined);
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue("date", date);
      
      // Get available time slots for this date
      const slots = getAvailableTimeSlots(date);
      setTimeSlots(slots);
      
      // Reset time slot selection
      form.resetField("timeSlotId");
    }
  };
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Find selected doctor and location
    const doctor = availableDoctors.find(doc => doc.id === data.doctorId);
    const location = locations.find(loc => loc.id === data.locationId);
    const timeSlot = timeSlots.find(slot => slot.id === data.timeSlotId);
    
    if (!doctor || !location || !timeSlot) {
      toast.error("Erro ao agendar consulta. Dados inválidos.");
      return;
    }
    
    // Format date for storage
    const formattedDate = format(data.date, 'yyyy-MM-dd');
    
    // Save appointment
    const appointment = saveAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      locationId: location.id,
      locationName: location.name,
      locationAddress: location.address,
      date: formattedDate,
      time: timeSlot.time,
      confirmed: false,
    });
    
    toast.success("Consulta agendada com sucesso!");
    resetForm();
    onScheduled();
    onClose();
  };
  
  // Reset the form and state
  const resetForm = () => {
    form.reset();
    setStep(1);
    setSelectedSpecialty(null);
    setAvailableDoctors([]);
    setSelectedDate(undefined);
    setTimeSlots([]);
  };
  
  // Handle moving to next step
  const nextStep = () => {
    if (step === 1) {
      const doctorId = form.getValues("doctorId");
      const locationId = form.getValues("locationId");
      if (!doctorId || !locationId) {
        form.trigger(["doctorId", "locationId"]);
        return;
      }
    } else if (step === 2) {
      const date = form.getValues("date");
      const timeSlotId = form.getValues("timeSlotId");
      if (!date || !timeSlotId) {
        form.trigger(["date", "timeSlotId"]);
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  // Handle going back to previous step
  const prevStep = () => {
    setStep(step - 1);
  };
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agendar Nova Consulta</DialogTitle>
          <DialogDescription>
            {step === 1 && "Selecione a especialidade, profissional e unidade de atendimento."}
            {step === 2 && "Escolha a data e horário para sua consulta."}
            {step === 3 && "Confirme os detalhes do agendamento."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                {/* Specialty selection */}
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <Select 
                        onValueChange={(value) => handleSpecialtyChange(value)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma especialidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Doctor selection */}
                <FormField
                  control={form.control}
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissional</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        disabled={!selectedSpecialty}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um profissional" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableDoctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id.toString()}>
                              {doctor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Location selection */}
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade de Atendimento</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        disabled={!selectedSpecialty}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma unidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id.toString()}>
                              {location.name} - {location.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                {/* Date selection */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data da Consulta</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={handleDateSelect}
                        disabled={(date) => 
                          date < new Date() || // Disable past dates
                          date.getDay() === 0 || // Disable Sundays
                          date.getDay() === 6    // Disable Saturdays
                        }
                        locale={ptBR}
                        className="border rounded-md p-3"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Time slot selection */}
                <FormField
                  control={form.control}
                  name="timeSlotId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                        disabled={!selectedDate}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots
                            .filter(slot => slot.available)
                            .map((slot) => (
                              <SelectItem key={slot.id} value={slot.id.toString()}>
                                {slot.time}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {timeSlots.length > 0 && timeSlots.filter(slot => slot.available).length === 0 && (
                        <FormDescription className="text-red-500">
                          Não há horários disponíveis para esta data. Por favor, selecione outra data.
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Confirme os detalhes da consulta:</h3>
                
                {(() => {
                  const values = form.getValues();
                  const doctor = availableDoctors.find(doc => doc.id === values.doctorId);
                  const location = locations.find(loc => loc.id === values.locationId);
                  const timeSlot = timeSlots.find(slot => slot.id === values.timeSlotId);
                  
                  return (
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Especialidade:</span> {values.specialty}</p>
                      <p><span className="font-semibold">Profissional:</span> {doctor?.name}</p>
                      <p><span className="font-semibold">Local:</span> {location?.name}</p>
                      <p><span className="font-semibold">Endereço:</span> {location?.address}, {location?.city}</p>
                      <p><span className="font-semibold">Data:</span> {values.date ? format(values.date, "dd 'de' MMMM 'de' yyyy", {locale: ptBR}) : ''}</p>
                      <p><span className="font-semibold">Horário:</span> {timeSlot?.time}</p>
                    </div>
                  );
                })()}
              </div>
            )}
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
              )}
              
              {step < 3 && (
                <Button type="button" onClick={nextStep}>
                  Próximo
                </Button>
              )}
              
              {step === 3 && (
                <Button type="submit" className="bg-care-purple hover:bg-care-light-purple">
                  Confirmar Agendamento
                </Button>
              )}
              
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentScheduler;
