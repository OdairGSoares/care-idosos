
import React from 'react';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Check, Clock, Bell, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Medication {
  id: string;
  medicationName: string;
  medicationTime: string;
  taken: boolean;
  name: string;
  time: string;
  dosage: string;
  reminder?: boolean;
}

const MedicationReminder = () => {
  const [meds, setMeds] = React.useState<Medication[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [userHasNoMeds, setUserHasNoMeds] = React.useState(false);

  useEffect(() => {
    loadMedications();
  }, []);

  // Atualizar o componente a cada minuto para refletir mudanças de horário
  useEffect(() => {
    const interval = setInterval(() => {
      // Forçar re-render para atualizar indicadores de atraso
      setMeds(prevMeds => [...prevMeds]);
    }, 60000); // A cada 1 minuto

    return () => clearInterval(interval);
  }, []);

  // Função para verificar se o horário do medicamento já passou
  const isMedicationLate = (medicationTime: string): boolean => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Tempo atual em minutos
    
    const [hours, minutes] = medicationTime.split(':').map(Number);
    const medicationTimeInMinutes = hours * 60 + minutes;
    
    return currentTime > medicationTimeInMinutes;
  };

  // Função para calcular há quanto tempo o medicamento está atrasado
  const getLateTime = (medicationTime: string): string => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [hours, minutes] = medicationTime.split(':').map(Number);
    const medicationTimeInMinutes = hours * 60 + minutes;
    
    const diffMinutes = currentTime - medicationTimeInMinutes;
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min atraso`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      return `${diffHours}h${remainingMinutes > 0 ? remainingMinutes + 'm' : ''} atraso`;
    }
  };

  async function loadMedications() {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    if (!authToken || !userId) {
      console.error('Token de autenticação ou ID do usuário não encontrado.');
      setLoading(false);
      toast.error('Por favor, faça login novamente.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/medications', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.error('Token inválido ou expirado');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        toast.error('Sua sessão expirou. Por favor, faça login novamente.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro ao buscar medicamentos: ${response.status}`);
      }

      const medications = await response.json();
      
      // Mapear dados garantindo que todos os campos estejam presentes
      const formattedMedications = medications.map((med: any) => ({
        id: med.id,
        medicationName: med.medicationName || med.name,
        medicationTime: med.medicationTime || med.time,
        taken: med.taken || false,
        name: med.name || med.medicationName,
        time: med.time || med.medicationTime,
        dosage: med.dosage || '',
        reminder: med.reminder || false
      }));
      
      setMeds(formattedMedications);
      setUserHasNoMeds(formattedMedications.length === 0);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      toast.error('Erro ao carregar medicamentos');
    } finally {
      setLoading(false);
    }
  }

  const markAsTaken = async (id: string) => {
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      toast.error('Token de autenticação não encontrado.');
      return;
    }

    try {
      const response = await fetch(`/api/medications/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taken: true })
      });

      if (response.status === 401) {
        toast.error('Sua sessão expirou. Por favor, faça login novamente.');
        return;
      }

      if (response.status === 404) {
        toast.error('Medicamento não encontrado ou você não tem acesso a ele.');
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao atualizar medicamento');
      }

      const result = await response.json();

      // Encontrar o medicamento antes de atualizar
      const medication = meds.find(med => med.id === id);
      const wasLate = medication && isMedicationLate(medication.time);

      // Atualizar estado local
      const updatedMeds = meds.map(med => 
        med.id === id ? { ...med, taken: true } : med
      );
      
      setMeds(updatedMeds);
      
      // Feedback específico baseado no horário
      if (wasLate) {
        toast.success("Medicamento registrado! Tente manter os horários para melhor eficácia.", {
          description: `${medication?.name} foi marcado como tomado com atraso.`
        });
      } else {
        toast.success("Ótimo! Medicamento tomado no horário correto.", {
          description: `${medication?.name} registrado com sucesso.`
        });
      }
    } catch (error) {
      console.error('Erro ao marcar medicamento como tomado:', error);
      toast.error("Erro ao registrar medicamento");
    }
  };
  
  const setupReminder = async (id: string) => {
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      toast.error('Token de autenticação não encontrado.');
      return;
    }

    const medication = meds.find(med => med.id === id);
    if (!medication) {
      toast.error('Medicamento não encontrado.');
      return;
    }

    try {
      const response = await fetch(`/api/medications/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reminder: true })
      });

      if (response.status === 401) {
        toast.error('Sua sessão expirou. Por favor, faça login novamente.');
        return;
      }

      if (response.status === 404) {
        toast.error('Medicamento não encontrado ou você não tem acesso a ele.');
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao configurar lembrete');
      }

      // Atualizar estado local
      const updatedMeds = meds.map(med => 
        med.id === id ? { ...med, reminder: true } : med
      );
      
      setMeds(updatedMeds);
      toast.success(`Lembrete configurado para ${medication.name} às ${medication.time}`);
      
      // Configurar notificação do navegador se permitido
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          // Exemplo de notificação imediata (em produção, seria agendada)
          setTimeout(() => {
            new Notification(`Lembrete ativado: ${medication.name}`, {
              body: `Você receberá notificações para tomar ${medication.dosage} às ${medication.time}`,
              icon: '/favicon.svg'
            });
          }, 1000);
        } else if (Notification.permission !== 'denied') {
          // Solicitar permissão
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            toast.success('Notificações ativadas! Você receberá lembretes no navegador.');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao configurar lembrete:', error);
      toast.error('Erro ao configurar lembrete');
    }
  };

  // Filtrar medicamentos para hoje (medicamentos não tomados)
  const todayMeds = meds.filter(med => !med.taken).slice(0, 3); // Mostrar primeiros 3 não tomados
  
  // Contar medicamentos atrasados
  const lateMeds = todayMeds.filter(med => isMedicationLate(med.time));
  const lateCount = lateMeds.length;

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-care-purple" />
            <CardTitle className="text-lg">Medicamentos</CardTitle>
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
      <CardContent>
        {/* Alerta para medicamentos atrasados */}
        {lateCount > 0 && !loading && !userHasNoMeds && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <p className="text-red-700 font-medium text-sm">
                {lateCount === 1 
                  ? 'Você tem 1 medicamento em atraso' 
                  : `Você tem ${lateCount} medicamentos em atraso`
                }
              </p>
            </div>
            <p className="text-red-600 text-xs mt-1 ml-4">
              Verifique os horários abaixo e registre os medicamentos tomados.
            </p>
          </div>
        )}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-14 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Pill className="h-6 w-6 text-care-purple" />
          <CardTitle className="text-lg">Medicamentos</CardTitle>
        </div>
        <Link href="/dashboard/medications">
          <Button size="sm" className="hover:bg-care-teal bg-care-dark-teal text-white">
            Ver todos
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {userHasNoMeds ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-care-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="h-8 w-8 text-care-purple" />
            </div>
            <h3 className="text-lg font-medium text-care-purple mb-2">
              Nenhum medicamento cadastrado
            </h3>
            <p className="text-care-purple mb-6 max-w-sm mx-auto">
              Você ainda não adicionou nenhum medicamento ao seu plano de cuidados. 
              Comece adicionando seus medicamentos para receber lembretes.
            </p>
            <Link href="/dashboard/medications">
              <Button className="bg-care-teal hover:bg-care-dark-teal">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Medicamento
              </Button>
            </Link>
          </div>
        ) : todayMeds.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-care-purple mb-2">
              Parabéns! 🎉
            </h3>
            <p className="text-care-purple mb-4">
              Todos os medicamentos de hoje foram tomados!
            </p>
            <Link href="/dashboard/medications">
              <Button className="hover:bg-care-teal bg-care-dark-teal text-white">
                Ver todos os medicamentos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {todayMeds.map((med) => {
              const isLate = !med.taken && isMedicationLate(med.time);
              const hasReminder = med.reminder;
              
              return (
                <div 
                  key={med.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isLate 
                      ? 'bg-red-50 border-red-200 hover:border-red-300' 
                      : 'bg-gray-50 border-gray-100 hover:border-care-teal/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      med.taken 
                        ? 'bg-green-500' 
                        : isLate 
                          ? 'bg-red-500 animate-pulse' 
                          : 'bg-yellow-500'
                    }`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-care-purple">{med.name}</p>
                        {hasReminder && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-care-purple/10 text-care-purple text-xs rounded-full">
                            <Bell className="h-3 w-3" />
                            <span>Lembrete ativo</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="flex items-center text-care-purple">
                          <Clock className="h-3 w-3 mr-1" />
                          {med.dosage} às {med.time}
                        </div>
                        {isLate && (
                          <span className="text-red-500 font-medium">
                            • {getLateTime(med.time)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!med.taken && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setupReminder(med.id)}
                          disabled={hasReminder}
                          className={`flex items-center space-x-1 ${
                            hasReminder
                              ? 'border-gray-200 text-care-purple cursor-not-allowed'
                              : 'border-care-purple/20 text-care-purple hover:bg-care-purple/5'
                          }`}
                        >
                          <Bell className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            {hasReminder ? 'Configurado' : 'Lembrete'}
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => markAsTaken(med.id)}
                          className={`flex items-center space-x-1 ${
                            isLate
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-care-teal hover:bg-care-dark-teal'
                          }`}
                        >
                          <Check className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            {isLate ? 'Marcar como tomado' : 'Tomei'}
                          </span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <Button
              variant="ghost"
              className="w-full mt-4 text-care-teal hover:text-care-dark-teal hover:bg-care-teal/5"
              asChild
            >
              <Link href="/dashboard/medications">
                <Pill className="h-5 w-5 mr-2" />
                Gerenciar Medicamentos
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationReminder;
