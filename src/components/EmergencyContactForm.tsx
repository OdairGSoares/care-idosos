
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EmergencyContact } from '@/utils/emergencyContactsUtils';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  phone: z.string().min(8, { message: 'Número de telefone inválido.' }),
  relationship: z.string().min(2, { message: 'O relacionamento deve ter pelo menos 2 caracteres.' }),
  isMainContact: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

interface EmergencyContactFormProps {
  contact?: EmergencyContact;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const EmergencyContactForm = ({ contact, onSubmit, onCancel }: EmergencyContactFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: contact ? {
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isMainContact: contact.isMainContact,
    } : {
      name: '',
      phone: '',
      relationship: '',
      isMainContact: false,
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-senior">Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome completo" {...field} className="text-senior" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-senior">Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} className="text-senior" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-senior">Relacionamento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Filho, Irmão, Cuidador" {...field} className="text-senior" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isMainContact"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-senior">
                  Definir como contato principal
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="text-senior"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-care-purple hover:bg-care-light-purple text-senior"
          >
            {contact ? 'Atualizar' : 'Adicionar'} Contato
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmergencyContactForm;
