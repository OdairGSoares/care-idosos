
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HealthData, HealthDataType, addHealthData } from '@/utils/healthDataUtils';
import { toast } from 'sonner';

const formSchema = z.object({
  type: z.enum(['bloodPressure', 'heartRate', 'glucose', 'weight', 'temperature'], {
    required_error: 'Por favor selecione o tipo de medição',
  }),
  value: z.string().min(1, { message: 'Digite um valor válido' }),
  secondaryValue: z.string().optional(),
  date: z.date({
    required_error: 'Por favor selecione uma data',
  }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface HealthDataFormProps {
  onComplete: () => void;
}

const HealthDataForm = ({ onComplete }: HealthDataFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'bloodPressure',
      value: '',
      secondaryValue: '',
      date: new Date(),
      notes: '',
    },
  });

  const watchType = form.watch('type');

  const onSubmit = (data: FormData) => {
    try {
      const healthData: Omit<HealthData, 'id'> = {
        type: data.type as HealthDataType,
        value: data.value,
        secondaryValue: data.type === 'bloodPressure' ? Number(data.secondaryValue) : undefined,
        date: format(data.date, 'yyyy-MM-dd'),
        notes: data.notes,
      };
      
      addHealthData(healthData);
      toast.success('Dados de saúde registrados com sucesso!');
      form.reset();
      onComplete();
    } catch (error) {
      console.error('Erro ao salvar dados de saúde:', error);
      toast.error('Erro ao salvar os dados. Tente novamente.');
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'bloodPressure': return 'Sistólica (mmHg)';
      case 'heartRate': return 'Batimentos Por Minuto';
      case 'glucose': return 'Nível de Glicose (mg/dL)';
      case 'weight': return 'Peso (kg)';
      case 'temperature': return 'Temperatura (°C)';
      default: return 'Valor';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Medição</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de medição" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bloodPressure">Pressão Arterial</SelectItem>
                  <SelectItem value="heartRate">Frequência Cardíaca</SelectItem>
                  <SelectItem value="glucose">Glicose</SelectItem>
                  <SelectItem value="weight">Peso</SelectItem>
                  <SelectItem value="temperature">Temperatura</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Escolha o tipo de medição que deseja registrar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getLabel(watchType)}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 120" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchType === 'bloodPressure' && (
          <FormField
            control={form.control}
            name="secondaryValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diastólica (mmHg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ex: 80" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Medição</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    disabled={(date) => date > new Date()}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações adicionais sobre esta medição..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Informações complementares sobre como você se sentiu, ou detalhes relevantes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Salvar Medição</Button>
      </form>
    </Form>
  );
};

export default HealthDataForm;
