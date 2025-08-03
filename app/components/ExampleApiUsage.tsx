import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2, Edit, Check } from 'lucide-react';
import {
  useMedications,
  useAddMedication,
  useRemoveMedication,
  useUpdateMedicationTaken,
  useAppointments,
  useAddAppointment,
  useDoctors,
  useLocations,
  useEmergencyContacts,
  useAddEmergencyContact
} from '@/hooks/useApi';
import type {
  IMedicationsDataWithoutId,
  IAppointmentData,
  IContactsDataWithoutId
} from '@/types/api';

/**
 * Componente de exemplo demonstrando como usar a API
 * Este componente mostra como integrar todos os serviços criados
 */
const ExampleApiUsage: React.FC = () => {
  // Estados para formulários
  const [newMedication, setNewMedication] = useState<IMedicationsDataWithoutId>({
    name: '',
    dosage: 0,
    time: '',
  });

  const [newContact, setNewContact] = useState<IContactsDataWithoutId>({
    name: '',
    phone: '',
    relationship: '',
    isMainContact: false,
  });

  // Hooks para buscar dados
  const { 
    data: medications, 
    isLoading: medicationsLoading, 
    error: medicationsError 
  } = useMedications();

  const { 
    data: appointments, 
    isLoading: appointmentsLoading 
  } = useAppointments();

  const { 
    data: doctors, 
    isLoading: doctorsLoading 
  } = useDoctors();

  const { 
    data: locations 
  } = useLocations();

  const { 
    data: emergencyContacts 
  } = useEmergencyContacts();

  // Mutations para operações CRUD
  const addMedicationMutation = useAddMedication();
  const removeMedicationMutation = useRemoveMedication();
  const updateMedicationTakenMutation = useUpdateMedicationTaken();
  const addAppointmentMutation = useAddAppointment();
  const addContactMutation = useAddEmergencyContact();

  // Handlers
  const handleAddMedication = async () => {
    if (!newMedication.name || !newMedication.time) {
      return;
    }

    try {
      await addMedicationMutation.mutateAsync(newMedication);
      setNewMedication({ name: '', dosage: 0, time: '' });
    } catch (error) {
      console.error('Erro ao adicionar medicamento:', error);
    }
  };

  const handleRemoveMedication = async (id: string) => {
    try {
      await removeMedicationMutation.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao remover medicamento:', error);
    }
  };

  const handleToggleMedicationTaken = async (id: string, currentStatus: boolean) => {
    try {
      await updateMedicationTakenMutation.mutateAsync({
        id,
        takenData: { taken: !currentStatus }
      });
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      return;
    }

    try {
      await addContactMutation.mutateAsync(newContact);
      setNewContact({ name: '', phone: '', relationship: '', isMainContact: false });
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
    }
  };

  const handleScheduleAppointment = async () => {
    if (!doctors?.length || !locations?.length) {
      return;
    }

    const appointmentData: IAppointmentData = {
      doctorId: doctors[0].doctorId,
      locationId: locations[0].locationId,
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      createdAt: new Date().toISOString(),
    };

    try {
      await addAppointmentMutation.mutateAsync(appointmentData);
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Exemplo de Uso da API</h1>
      
      {/* Seção de Medicamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💊 Medicamentos
            {medicationsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulário para adicionar medicamento */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="med-name">Nome</Label>
              <Input
                id="med-name"
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do medicamento"
              />
            </div>
            <div>
              <Label htmlFor="med-dosage">Dosagem (mg)</Label>
              <Input
                id="med-dosage"
                type="number"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: Number(e.target.value) }))}
                placeholder="Dosagem"
              />
            </div>
            <div>
              <Label htmlFor="med-time">Horário</Label>
              <Input
                id="med-time"
                type="time"
                value={newMedication.time}
                onChange={(e) => setNewMedication(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddMedication}
                disabled={addMedicationMutation.isPending}
                className="w-full"
              >
                {addMedicationMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Adicionar
              </Button>
            </div>
          </div>

          {/* Lista de medicamentos */}
          <div className="space-y-2">
            {medicationsError && (
              <p className="text-red-500">Erro ao carregar medicamentos</p>
            )}
            
            {medications?.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <span className="font-medium">{med.name}</span>
                  <span className="ml-2 text-care-purple">{med.dosage}mg às {med.time}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleMedicationTaken(med.id, false)} // Assumindo não tomado
                    disabled={updateMedicationTakenMutation.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMedication(med.id)}
                    disabled={removeMedicationMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {medications?.length === 0 && (
              <p className="text-care-purple text-center py-4">Nenhum medicamento cadastrado</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Agendamentos
            {appointmentsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleScheduleAppointment}
            disabled={addAppointmentMutation.isPending || !doctors?.length || !locations?.length}
          >
            {addAppointmentMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Agendar Consulta de Exemplo
          </Button>

          <div className="space-y-2">
            {appointments?.map((appointment) => (
              <div key={appointment.id} className="p-3 border rounded">
                <div>Data: {appointment.date} às {appointment.time}</div>
                <div>Médico ID: {appointment.doctorId}</div>
                <div>Local ID: {appointment.locationId}</div>
              </div>
            ))}
            
            {appointments?.length === 0 && (
              <p className="text-care-purple text-center py-4">Nenhum agendamento encontrado</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção de Médicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👨‍⚕️ Médicos Disponíveis
            {doctorsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors?.map((doctor) => (
              <div key={doctor.doctorId} className="p-3 border rounded">
                <div className="font-medium">{doctor.doctorName}</div>
                <div className="text-sm text-care-purple">{doctor.specialty}</div>
              </div>
            ))}
          </div>
          
          {doctors?.length === 0 && (
            <p className="text-care-purple text-center py-4">Nenhum médico disponível</p>
          )}
        </CardContent>
      </Card>

      {/* Seção de Contatos de Emergência */}
      <Card>
        <CardHeader>
          <CardTitle>🚨 Contatos de Emergência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulário para adicionar contato */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="contact-name">Nome</Label>
              <Input
                id="contact-name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do contato"
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Telefone</Label>
              <Input
                id="contact-phone"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Telefone"
              />
            </div>
            <div>
              <Label htmlFor="contact-relationship">Relacionamento</Label>
              <Input
                id="contact-relationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                placeholder="Ex: Filho, Médico"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddContact}
                disabled={addContactMutation.isPending}
                className="w-full"
              >
                {addContactMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Adicionar
              </Button>
            </div>
          </div>

          {/* Lista de contatos */}
          <div className="space-y-2">
            {emergencyContacts?.map((contact) => (
              <div key={contact.id} className="p-3 border rounded">
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-care-purple">
                  {contact.phone} - {contact.relationship}
                  {contact.isMainContact && <span className="ml-2 text-blue-500">(Principal)</span>}
                </div>
              </div>
            ))}
            
            {emergencyContacts?.length === 0 && (
              <p className="text-care-purple text-center py-4">Nenhum contato cadastrado</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status da API */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Status da API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Medicamentos</div>
              <div className={medicationsLoading ? 'text-yellow-500' : 'text-green-500'}>
                {medicationsLoading ? 'Carregando...' : `${medications?.length || 0} encontrados`}
              </div>
            </div>
            
            <div>
              <div className="font-medium">Agendamentos</div>
              <div className={appointmentsLoading ? 'text-yellow-500' : 'text-green-500'}>
                {appointmentsLoading ? 'Carregando...' : `${appointments?.length || 0} encontrados`}
              </div>
            </div>
            
            <div>
              <div className="font-medium">Médicos</div>
              <div className={doctorsLoading ? 'text-yellow-500' : 'text-green-500'}>
                {doctorsLoading ? 'Carregando...' : `${doctors?.length || 0} disponíveis`}
              </div>
            </div>
            
            <div>
              <div className="font-medium">Contatos</div>
              <div className="text-green-500">
                {emergencyContacts?.length || 0} cadastrados
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExampleApiUsage; 