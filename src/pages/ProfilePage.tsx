
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthDataType, getHealthDataByType, generateSampleHealthData } from '@/utils/healthDataUtils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { User, Activity, Heart, Droplet, Scale, Thermometer, Plus } from 'lucide-react';
import HealthDataChart from '@/components/HealthDataChart';
import HealthDataHistory from '@/components/HealthDataHistory';
import HealthDataForm from '@/components/HealthDataForm';

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState<HealthDataType>('bloodPressure');
  const [healthData, setHealthData] = useState<{
    bloodPressure: any[];
    heartRate: any[];
    glucose: any[];
    weight: any[];
    temperature: any[];
  }>({
    bloodPressure: [],
    heartRate: [],
    glucose: [],
    weight: [],
    temperature: [],
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formType, setFormType] = useState<HealthDataType>('bloodPressure');

  useEffect(() => {
    // Gerar dados de exemplo na primeira carga
    generateSampleHealthData();
    loadHealthData();
  }, []);

  const loadHealthData = () => {
    setHealthData({
      bloodPressure: getHealthDataByType('bloodPressure'),
      heartRate: getHealthDataByType('heartRate'),
      glucose: getHealthDataByType('glucose'),
      weight: getHealthDataByType('weight'),
      temperature: getHealthDataByType('temperature'),
    });
  };

  const handleAddClick = (type: HealthDataType) => {
    setFormType(type);
    setSheetOpen(true);
  };

  const handleFormComplete = () => {
    setSheetOpen(false);
    loadHealthData();
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

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <div className="mr-4 rounded-full bg-primary/10 p-2">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Meu Perfil de Saúde</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Acompanhe seus dados de saúde ao longo do tempo
            </p>
          </div>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Medição
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Registrar Nova Medição</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <HealthDataForm onComplete={handleFormComplete} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="bloodPressure" onValueChange={(value) => setSelectedTab(value as HealthDataType)}>
        <TabsList className="grid w-full grid-cols-5 mb-4 sm:mb-6 overflow-x-auto">
          <TabsTrigger value="bloodPressure" className="px-2 sm:px-4">
            {getTabIcon('bloodPressure')}
            <span className="ml-1 sm:ml-2 hidden sm:inline">Pressão</span>
          </TabsTrigger>
          <TabsTrigger value="heartRate" className="px-2 sm:px-4">
            {getTabIcon('heartRate')}
            <span className="ml-1 sm:ml-2 hidden sm:inline">Batimentos</span>
          </TabsTrigger>
          <TabsTrigger value="glucose" className="px-2 sm:px-4">
            {getTabIcon('glucose')}
            <span className="ml-1 sm:ml-2 hidden sm:inline">Glicose</span>
          </TabsTrigger>
          <TabsTrigger value="weight" className="px-2 sm:px-4">
            {getTabIcon('weight')}
            <span className="ml-1 sm:ml-2 hidden sm:inline">Peso</span>
          </TabsTrigger>
          <TabsTrigger value="temperature" className="px-2 sm:px-4">
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
              onDataChange={loadHealthData} 
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
              onDataChange={loadHealthData} 
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
              onDataChange={loadHealthData} 
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
              onDataChange={loadHealthData} 
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
              onDataChange={loadHealthData} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
