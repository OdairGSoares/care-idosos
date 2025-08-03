
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Pill,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import axios from 'axios';

interface Medication {
  id: string; // Sempre string para consistência
  displayKey: string; // Key única para React (evita duplicatas)
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

const MedicationsPage = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id' | 'taken' | 'displayKey'>>({
    name: '',
    dosage: '',
    time: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resettingAll, setResettingAll] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  // Timeout de segurança para resetar deletingId se ficar "preso"
  useEffect(() => {
    if (deletingId) {
      const timeout = setTimeout(() => {
        console.warn('⚠️ Timeout de segurança - resetando estado de exclusão');
        setDeletingId(null);
        // Removido toast duplicado - o erro já é tratado no catch do handleDeleteMedication
      }, 10000); // 10 segundos de timeout

      return () => clearTimeout(timeout);
    }
  }, [deletingId]);

  useEffect(() => {
    // Validate form
    const isValid =
      newMedication.name.trim() !== '' &&
      newMedication.dosage.trim() !== '' &&
      newMedication.time.trim() !== '';

    setFormValid(isValid);

  }, [newMedication]);

  useEffect(() => {
    loadMedications();
  }, []); // Array de dependências vazio para evitar loop infinito

  const loadMedications = async () => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
      console.error('Token de autenticação ou userId não encontrado.');
      toast.error('Por favor, faça login novamente.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Carregando medicamentos para usuário:', userId);

      const response = await axios.get('/api/medications', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta da API de medicamentos:', response.data);

      if (response.status === 401) {
        console.error('Token inválido ou expirado');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        toast.error('Sua sessão expirou. Por favor, faça login novamente.');
        return;
      }

      // Verificar se recebemos um array
      if (!Array.isArray(response.data)) {
        console.error('API não retornou um array:', response.data);
        toast.error('Formato de dados inválido recebido da API');
        return;
      }

      // Mapear os dados da API local para o formato esperado
      const usedDisplayKeys = new Set<string>();
      const formattedMedications = response.data.map((med: any, index: number) => {
        console.log(`Medicamento ${index}:`, med);

        // Garantir que o ID é sempre string consistente
        const realId = String(med.id);

        // Criar uma displayKey única para React (evitar conflitos de renderização)
        let displayKey = `med-${realId}-${index}`;

        // Se a displayKey já foi usada, gerar uma nova
        if (usedDisplayKeys.has(displayKey)) {
          displayKey = `med-${realId}-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        }

        usedDisplayKeys.add(displayKey);

        return {
          id: realId, // ID real sempre como string para operações da API
          displayKey, // Key única para React
          name: med.name || med.medicationName || 'Nome não disponível',
          dosage: med.dosage || '',
          time: med.time || med.medicationTime || '00:00',
          taken: med.taken || false
        };
      });

      console.log('✅ Medicamentos carregados:', formattedMedications.length);

      setMedications(formattedMedications);

      if (formattedMedications.length === 0) {
        console.log('Nenhum medicamento encontrado para este usuário');
      } else {
        console.log(`${formattedMedications.length} medicamentos carregados com sucesso`);
      }

    } catch (error: unknown) {
      console.error('Erro completo ao carregar medicamentos:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error('Erro 401 - Token inválido');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          toast.error('Sua sessão expirou. Por favor, faça login novamente.');
        } else if (error.response?.status === 404) {
          console.error('Erro 404 - Endpoint não encontrado');
          toast.error('Serviço de medicamentos não encontrado');
        } else {
          console.error('Erro HTTP:', error.response?.status, error.response?.data);
          toast.error(`Erro ao carregar medicamentos: ${error.response?.status}`);
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro não HTTP:', errorMessage);
        toast.error('Erro de conexão ao carregar medicamentos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMedication = async () => {
    if (!formValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
      toast.error('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    try {
      // Preparar payload para a API local
      const payload = {
        name: newMedication.name.trim(),
        dosage: newMedication.dosage.trim(),
        time: newMedication.time
      };

      console.log('Adicionando medicamento:', payload);

      const response = await axios.post('/api/medications', payload, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta da API ao adicionar:', response.data);

      if (response.status === 201 || response.status === 200) {
        toast.success('Medicamento adicionado com sucesso!');

        // Recarregar medicamentos para garantir sincronização
        await loadMedications();

        // Reset form
        setNewMedication({
          name: '',
          dosage: '',
          time: '',
        });

        setDialogOpen(false);
      } else {
        console.error('Status inesperado:', response.status);
        toast.error('Erro inesperado ao adicionar medicamento.');
      }

    } catch (error: unknown) {
      console.error('Erro ao adicionar medicamento:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          toast.error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 400) {
          toast.error('Dados inválidos. Verifique os campos e tente novamente.');
        } else {
          toast.error(`Erro ao adicionar medicamento: ${error.response?.status}`);
        }
      } else {
        toast.error('Erro de conexão ao adicionar medicamento.');
      }
    }
  };

  const handleDeleteMedication = async (id: string) => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
      toast.error('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    // Encontrar o medicamento para validação e informações
    const medication = medications.find(med => med.id === id);
    const medicationName = medication?.name || 'este medicamento';

    // Validação extra: verificar se o medicamento existe na lista
    if (!medication) {
      console.error('❌ Medicamento não encontrado na lista local:', id);
      toast.error('Erro: Medicamento não encontrado na lista.');
      return;
    }

    try {
      setDeletingId(id);

      const response = await axios.delete(`/api/medications/${id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Resposta da API ao deletar:', response.data);

      if (response.status === 200) {
        toast.success(`${medicationName} removido com sucesso!`);

        // Remover do estado local imediatamente para melhor UX
        setMedications(prev => prev.filter(med => med.id !== id));
      } else {
        console.error('❌ Status inesperado ao deletar:', response.status);
        toast.error('Erro inesperado ao remover medicamento.');
      }

    } catch (error: unknown) {
      console.error('❌ Erro ao deletar medicamento:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          toast.error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 404) {
          toast.error('Medicamento não encontrado ou você não tem acesso a ele.');
        } else {
          toast.error(`Erro ao remover medicamento: ${error.response?.status}`);
        }
      } else {
        toast.error('Erro de conexão ao remover medicamento.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const resetAllMedications = async () => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
      toast.error('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    if (medications.length === 0) {
      toast.info('Não há medicamentos para remover.');
      setDeleteAllDialogOpen(false);
      return;
    }

    try {
      setResettingAll(true);
      console.log('🧹 Removendo todos os medicamentos. Total:', medications.length);

      // Usar endpoint específico para deletar todos de uma vez
      const response = await axios.delete('/api/medications/reset', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Resposta da API ao resetar:', response.data);

      if (response.status === 200 && response.data.success) {
        setMedications([]);
        toast.success(response.data.message);
        setDeleteAllDialogOpen(false);
      } else {
        console.error('❌ Status inesperado ao resetar:', response.status);
        toast.error('Erro inesperado ao remover medicamentos.');
      }

    } catch (error: unknown) {
      console.error('❌ Erro ao remover todos os medicamentos:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          toast.error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 404) {
          toast.error('Endpoint não encontrado.');
        } else {
          toast.error(`Erro ao remover medicamentos: ${error.response?.status}`);
        }
      } else {
        toast.error('Erro de conexão ao remover medicamentos.');
      }
    } finally {
      setResettingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="h-8 w-48 sm:w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full sm:w-36 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 sm:w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 sm:w-64 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full mr-3 animate-pulse flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <div className="h-4 sm:h-5 w-24 sm:w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded animate-pulse ml-2 flex-shrink-0"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 text-care-purple">Medicamentos</h1>
          <p className="text-sm sm:text-base text-care-purple">Gerencie seus medicamentos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto hover:bg-care-light-purple bg-care-purple text-white text-sm sm:text-base">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden sm:inline">Novo Medicamento</span>
              <span className="sm:hidden">Adicionar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl text-care-purple">Adicionar Medicamento</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-care-dark-teal text-sm sm:text-base">Nome do Medicamento</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Losartana"
                  value={newMedication.name}
                  onChange={handleInputChange}
                  className="text-care-purple text-sm sm:text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosage" className="text-care-dark-teal text-sm sm:text-base">Dosagem</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  placeholder="Ex: 50mg"
                  value={newMedication.dosage}
                  onChange={handleInputChange}
                  className="text-care-purple text-sm sm:text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className="text-care-dark-teal text-sm sm:text-base">Horário</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={newMedication.time}
                  onChange={handleInputChange}
                  className="text-care-purple text-sm sm:text-base"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleAddMedication}
                disabled={!formValid}
                className="text-care-dark-teal hover:bg-care-dark-teal text-white w-full text-sm sm:text-base"
              >
                Adicionar Medicamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {medications.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-xl text-care-purple">Seus Medicamentos</CardTitle>
                <CardDescription className='text-care-purple mt-2 text-sm sm:text-base'>
                  Gerencie seus lembretes de medicamentos
                </CardDescription>
              </div>

              <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs sm:text-sm w-full sm:w-auto"
                    disabled={resettingAll || medications.length === 0}
                  >
                    {resettingAll ? (
                      <>
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                        <span className="hidden sm:inline">Removendo...</span>
                        <span className="sm:hidden">Removendo</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        <span className="hidden sm:inline">Excluir Todos</span>
                        <span className="sm:hidden">Excluir Todos</span>
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[95vw] max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                      Confirmar Exclusão de Todos os Medicamentos
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm sm:text-base">
                      Esta ação irá <strong>remover permanentemente todos os {medications.length} medicamentos</strong> da sua lista.
                      <br /><br />
                      Esta ação <strong>não pode ser desfeita</strong>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel disabled={resettingAll} className="w-full sm:w-auto">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={resetAllMedications}
                      disabled={resettingAll}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600 w-full sm:w-auto"
                    >
                      {resettingAll ? (
                        <>
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                          <span className="hidden sm:inline">Removendo...</span>
                          <span className="sm:hidden">Removendo</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          <span className="hidden sm:inline">Sim, Excluir Todos</span>
                          <span className="sm:hidden">Excluir Todos</span>
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {medications.map((medication) => (
                <div
                  key={medication.displayKey}
                  className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="p-1.5 sm:p-2 bg-care-light-teal rounded-full mr-3 flex-shrink-0">
                      <Pill className="h-4 w-4 sm:h-5 sm:w-5 text-care-teal" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-medium text-care-purple truncate">
                        {medication.name}
                        {medication.dosage && (
                          <span className="ml-2 text-care-teal font-normal text-sm sm:text-base">
                            {medication.dosage}
                          </span>
                        )}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-care-purple text-xs sm:text-sm gap-1 sm:gap-3">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span>{medication.time}</span>
                        </div>
                        {medication.taken && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs w-fit">
                            ✓ Tomado
                          </span>
                        )}
                        <span className="text-xs text-care-purple opacity-75">
                          ID: {medication.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 ml-2 flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0"
                        disabled={deletingId === medication.id}
                      >
                        {deletingId === medication.id ? (
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[95vw] max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                          Confirmar Exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm sm:text-base">
                          Tem certeza que deseja remover <strong>{medication.name}</strong>?
                          <br /><br />
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel disabled={deletingId === medication.id} className="w-full sm:w-auto">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMedication(medication.id)}
                          disabled={deletingId === medication.id}
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-600 w-full sm:w-auto"
                        >
                          {deletingId === medication.id ? (
                            <>
                              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                              <span className="hidden sm:inline">Removendo...</span>
                              <span className="sm:hidden">Removendo</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              <span className="hidden sm:inline">Sim, Excluir</span>
                              <span className="sm:hidden">Excluir</span>
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardContent className="py-8 sm:py-10 px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-full mb-3 sm:mb-4">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-care-purple mb-2">
                Nenhum medicamento cadastrado
              </h3>
              <p className="text-care-purple mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                Você ainda não tem medicamentos cadastrados. Adicione seu primeiro medicamento clicando no botão abaixo.
              </p>

              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-care-teal hover:bg-care-dark-teal text-white text-sm sm:text-base w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Adicionar Primeiro Medicamento
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicationsPage;
