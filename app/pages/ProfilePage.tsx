
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthDataType, getHealthDataByType, generateSampleHealthData, HealthData } from '@/utils/healthDataUtils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { User, Activity, Heart, Droplet, Scale, Thermometer, Plus, RefreshCw } from 'lucide-react';
import HealthDataChart from '@/components/HealthDataChart';
import HealthDataHistory from '@/components/HealthDataHistory';
import HealthDataForm from '@/components/HealthDataForm';
import { toast } from 'sonner';

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState<HealthDataType>('bloodPressure');
  const [healthData, setHealthData] = useState<{
    bloodPressure: HealthData[];
    heartRate: HealthData[];
    glucose: HealthData[];
    weight: HealthData[];
    temperature: HealthData[];
  }>({
    bloodPressure: [],
    heartRate: [],
    glucose: [],
    weight: [],
    temperature: [],
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formType, setFormType] = useState<HealthDataType>('bloodPressure');
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    console.log('🔄 [ProfilePage] Carregando dados de saúde...');
    
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('❌ [ProfilePage] Token de autenticação não encontrado.');
      toast.error('Sessão expirada. Faça login novamente.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Carregar dados para cada tipo
      const [bloodPressureData, heartRateData, glucoseData, weightData, temperatureData] = await Promise.all([
        getHealthDataByType('bloodPressure'),
        getHealthDataByType('heartRate'),
        getHealthDataByType('glucose'),
        getHealthDataByType('weight'),
        getHealthDataByType('temperature')
      ]);

      setHealthData({
        bloodPressure: bloodPressureData,
        heartRate: heartRateData,
        glucose: glucoseData,
        weight: weightData,
        temperature: temperatureData,
      });

      console.log('✅ [ProfilePage] Dados carregados com sucesso');
      
    } catch (error) {
      console.error('❌ [ProfilePage] Erro ao carregar dados:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Sessão expirada') {
          toast.error('Sessão expirada. Faça login novamente.');
        } else {
          toast.error('Erro ao carregar dados de saúde.');
        }
      } else {
        toast.error('Erro de conexão ao carregar dados.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSample = async () => {
    console.log('🌱 [ProfilePage] Gerando dados de exemplo...');
    
    try {
      setIsGeneratingSample(true);
      await generateSampleHealthData();
      toast.success('Dados de exemplo gerados com sucesso!');
      
      // Recarregar dados após gerar exemplos
      await loadHealthData();
    } catch (error) {
      console.error('❌ [ProfilePage] Erro ao gerar dados de exemplo:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Sessão expirada') {
          toast.error('Sessão expirada. Faça login novamente.');
        } else {
          toast.error('Erro ao gerar dados de exemplo.');
        }
      } else {
        toast.error('Erro de conexão ao gerar dados.');
      }
    } finally {
      setIsGeneratingSample(false);
    }
  };

  const handleAddClick = (type: HealthDataType) => {
    setFormType(type);
    setSheetOpen(true);
  };

  const handleFormComplete = async () => {
    console.log('🔄 [ProfilePage] Formulário completado, recarregando dados...');
    setSheetOpen(false);
    setIsUpdating(true);
    
    try {
      // Recarregar todos os dados para garantir sincronização
      await loadHealthData();
      console.log('✅ [ProfilePage] Dados recarregados após adição');
    } catch (error) {
      console.error('❌ [ProfilePage] Erro ao recarregar dados após adição:', error);
      toast.error('Erro ao atualizar dados. Recarregue a página.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDataChange = async () => {
    console.log('🔄 [ProfilePage] Dados alterados, recarregando...');
    setIsUpdating(true);
    
    try {
      // Recarregar todos os dados para garantir sincronização
      await loadHealthData();
      console.log('✅ [ProfilePage] Dados recarregados após alteração');
    } catch (error) {
      console.error('❌ [ProfilePage] Erro ao recarregar dados após alteração:', error);
      toast.error('Erro ao atualizar dados. Recarregue a página.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getTabIcon = (type: HealthDataType) => {
    switch (type) {
      case 'bloodPressure':
        return <Activity className="h-4 w-4" />;
      case 'heartRate':
        return <Heart className="h-4 w-4" />;
      case 'glucose':
        return <Droplet className="h-4 w-4" />;
      case 'weight':
        return <Scale className="h-4 w-4" />;
      case 'temperature':
        return <Thermometer className="h-4 w-4" />;
    }
  };

  // Função para verificar se há dados
  const hasAnyData = Object.values(healthData).some(data => data.length > 0);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-care-purple/10 p-2">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-care-purple" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-care-purple">Meu Perfil de Saúde</h1>
                      <p className="text-sm sm:text-base text-care-purple">
            Acompanhe seus dados de saúde ao longo do tempo
          </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* Botão para gerar dados de exemplo se não houver dados */}
          {!hasAnyData && !isLoading && (
            <Button
              onClick={handleGenerateSample}
              disabled={isGeneratingSample}
              variant="outline"
              className="mr-2"
            >
              {isGeneratingSample ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Activity className="mr-2 h-4 w-4" />
              )}
              Gerar Exemplo
            </Button>
          )}
          
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button className="hover:bg-care-light-purple bg-care-purple text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nova Medição
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-care-purple">Registrar Nova Medição</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <HealthDataForm onComplete={handleFormComplete} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-care-purple mb-2" />
          <p className="text-care-purple">Carregando dados de saúde...</p>
        </div>
      ) : (
        <div className="relative">
          {isUpdating && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-6 w-6 animate-spin text-care-purple mb-2" />
                <p className="text-sm text-care-purple">Atualizando dados...</p>
              </div>
            </div>
          )}
          
                    <Tabs defaultValue="bloodPressure" onValueChange={(value) => setSelectedTab(value as HealthDataType)}>
            <TabsList className="grid w-full grid-cols-5 mb-4 sm:mb-6 overflow-x-auto">
              <TabsTrigger value="bloodPressure" className="px-2 sm:px-4 text-care-purple">
                {getTabIcon('bloodPressure')}
                <span className="ml-1 sm:ml-2 hidden sm:inline">Pressão</span>
              </TabsTrigger>
              <TabsTrigger value="heartRate" className="px-2 sm:px-4 text-care-purple">
                {getTabIcon('heartRate')}
                <span className="ml-1 sm:ml-2 hidden sm:inline">Batimentos</span>
              </TabsTrigger>
              <TabsTrigger value="glucose" className="px-2 sm:px-4 text-care-purple">
                {getTabIcon('glucose')}
                <span className="ml-1 sm:ml-2 hidden sm:inline">Glicose</span>
              </TabsTrigger>
              <TabsTrigger value="weight" className="px-2 sm:px-4 text-care-purple">
                {getTabIcon('weight')}
                <span className="ml-1 sm:ml-2 hidden sm:inline">Peso</span>
              </TabsTrigger>
              <TabsTrigger value="temperature" className="px-2 sm:px-4 text-care-purple">
                {getTabIcon('temperature')}
                <span className="ml-1 sm:ml-2 hidden sm:inline">Temperatura</span>
              </TabsTrigger>
            </TabsList>

            <div className="overflow-x-hidden">
              <TabsContent value="bloodPressure" className="mt-0">
                <HealthDataChart 
                  data={healthData.bloodPressure} 
                  type="bloodPressure" 
                  onAddClick={handleAddClick} 
                />
                <HealthDataHistory 
                  data={healthData.bloodPressure} 
                  type="bloodPressure" 
                  onDataChange={handleDataChange} 
                />
              </TabsContent>
              
              <TabsContent value="heartRate" className="mt-0">
                <HealthDataChart 
                  data={healthData.heartRate} 
                  type="heartRate" 
                  onAddClick={handleAddClick} 
                />
                <HealthDataHistory 
                  data={healthData.heartRate} 
                  type="heartRate" 
                  onDataChange={handleDataChange} 
                />
              </TabsContent>

              <TabsContent value="glucose" className="mt-0">
                <HealthDataChart 
                  data={healthData.glucose} 
                  type="glucose" 
                  onAddClick={handleAddClick} 
                />
                <HealthDataHistory 
                  data={healthData.glucose} 
                  type="glucose" 
                  onDataChange={handleDataChange} 
                />
              </TabsContent>

              <TabsContent value="weight" className="mt-0">
                <HealthDataChart 
                  data={healthData.weight} 
                  type="weight" 
                  onAddClick={handleAddClick} 
                />
                <HealthDataHistory 
                  data={healthData.weight} 
                  type="weight" 
                  onDataChange={handleDataChange} 
                />
              </TabsContent>

              <TabsContent value="temperature" className="mt-0">
                <HealthDataChart 
                  data={healthData.temperature} 
                  type="temperature" 
                  onAddClick={handleAddClick} 
                />
                <HealthDataHistory 
                  data={healthData.temperature} 
                  type="temperature" 
                  onDataChange={handleDataChange} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
