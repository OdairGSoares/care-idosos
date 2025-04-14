
export type HealthDataType = 'bloodPressure' | 'heartRate' | 'glucose' | 'weight' | 'temperature';

export interface HealthData {
  id: number;
  type: HealthDataType;
  value: number | string;
  secondaryValue?: number; // Para pressão arterial (diastólica)
  date: string;
  notes?: string;
}

const LOCAL_STORAGE_KEY = 'health_data';

// Função para obter todos os dados de saúde
export const getAllHealthData = (): HealthData[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Função para obter dados de saúde por tipo
export const getHealthDataByType = (type: HealthDataType): HealthData[] => {
  const allData = getAllHealthData();
  return allData.filter(data => data.type === type);
};

// Função para adicionar novo registro de saúde
export const addHealthData = (healthData: Omit<HealthData, 'id'>): HealthData => {
  const allData = getAllHealthData();
  const newId = allData.length > 0 ? Math.max(...allData.map(data => data.id)) + 1 : 1;
  
  const newHealthData = {
    ...healthData,
    id: newId,
  };
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...allData, newHealthData]));
  return newHealthData;
};

// Função para atualizar registro de saúde existente
export const updateHealthData = (updatedData: HealthData): HealthData => {
  const allData = getAllHealthData();
  const updatedDataList = allData.map(data => 
    data.id === updatedData.id ? updatedData : data
  );
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDataList));
  return updatedData;
};

// Função para deletar registro de saúde
export const deleteHealthData = (id: number): void => {
  const allData = getAllHealthData();
  const filteredData = allData.filter(data => data.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredData));
};

// Função para gerar dados de exemplo (para demonstração)
export const generateSampleHealthData = (): void => {
  const today = new Date();
  const sampleData: Omit<HealthData, 'id'>[] = [];
  
  // Gerar dados dos últimos 7 dias
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Pressão arterial (sistólica/diastólica)
    sampleData.push({
      type: 'bloodPressure',
      value: Math.floor(Math.random() * 20) + 110, // Sistólica entre 110-130
      secondaryValue: Math.floor(Math.random() * 15) + 70, // Diastólica entre 70-85
      date: dateStr,
    });
    
    // Frequência cardíaca
    sampleData.push({
      type: 'heartRate',
      value: Math.floor(Math.random() * 20) + 65, // Entre 65-85
      date: dateStr,
    });
    
    // Glicose
    sampleData.push({
      type: 'glucose',
      value: Math.floor(Math.random() * 40) + 80, // Entre 80-120
      date: dateStr,
    });
    
    // Peso
    if (i % 2 === 0) { // A cada dois dias
      sampleData.push({
        type: 'weight',
        value: (Math.random() * 5 + 70).toFixed(1), // Entre 70-75kg
        date: dateStr,
      });
    }
    
    // Temperatura
    if (i % 3 === 0) { // A cada três dias
      sampleData.push({
        type: 'temperature',
        value: (Math.random() * 1 + 36).toFixed(1), // Entre 36-37°C
        date: dateStr,
      });
    }
  }
  
  // Adicionar todos os dados de exemplo
  const allData = getAllHealthData();
  if (allData.length === 0) {
    sampleData.forEach(data => addHealthData(data));
  }
};
