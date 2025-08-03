import axios from 'axios';

export type HealthDataType = 'bloodPressure' | 'heartRate' | 'glucose' | 'weight' | 'temperature';

export interface HealthData {
  id: string;
  type: HealthDataType;
  value: number | string;
  secondaryValue?: number; // Para pressão arterial (diastólica)
  date: string;
  notes?: string;
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Função para obter token de autenticação
const getAuthHeaders = () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('Token de autenticação não encontrado');
  }
  return {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };
};

// Função para obter todos os dados de saúde
export const getAllHealthData = async (): Promise<HealthData[]> => {
  try {
    console.log('🔄 [HealthDataUtils] Carregando todos os dados de saúde...');
    
    const response = await axios.get('/api/health-data', {
      headers: getAuthHeaders()
    });

    console.log('✅ [HealthDataUtils] Dados carregados:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ [HealthDataUtils] Erro ao carregar dados:', error);
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      throw new Error('Sessão expirada');
    }
    
    throw new Error('Erro ao carregar dados de saúde');
  }
};

// Função para obter dados de saúde por tipo
export const getHealthDataByType = async (type: HealthDataType): Promise<HealthData[]> => {
  try {
    console.log('🔄 [HealthDataUtils] Carregando dados por tipo:', type);
    
    const response = await axios.get(`/api/health-data?type=${type}`, {
      headers: getAuthHeaders()
    });

    console.log('✅ [HealthDataUtils] Dados por tipo carregados:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ [HealthDataUtils] Erro ao carregar dados por tipo:', error);
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      throw new Error('Sessão expirada');
    }
    
    throw new Error('Erro ao carregar dados de saúde');
  }
};

// Função para obter dados de saúde por período
export const getHealthDataByDateRange = async (
  startDate: string, 
  endDate: string, 
  type?: HealthDataType
): Promise<HealthData[]> => {
  try {
    console.log('🔄 [HealthDataUtils] Carregando dados por período:', { startDate, endDate, type });
    
    let url = `/api/health-data?startDate=${startDate}&endDate=${endDate}`;
    if (type) {
      url += `&type=${type}`;
    }
    
    const response = await axios.get(url, {
      headers: getAuthHeaders()
    });

    console.log('✅ [HealthDataUtils] Dados por período carregados:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ [HealthDataUtils] Erro ao carregar dados por período:', error);
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      throw new Error('Sessão expirada');
    }
    
    throw new Error('Erro ao carregar dados de saúde');
  }
};

// Função para adicionar novo registro de saúde
export const addHealthData = async (healthData: Omit<HealthData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<HealthData> => {
  try {
    console.log('➕ [HealthDataUtils] Adicionando novo dado:', healthData);
    
    const response = await axios.post('/api/health-data', healthData, {
      headers: getAuthHeaders()
    });

    if (response.status === 201) {
      console.log('✅ [HealthDataUtils] Dado adicionado com sucesso:', response.data.data.id);
      return response.data.data;
    } else {
      throw new Error('Resposta inesperada da API');
    }
  } catch (error) {
    console.error('❌ [HealthDataUtils] Erro ao adicionar dado:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        throw new Error('Sessão expirada');
      } else if (error.response?.status === 400) {
        throw new Error('Dados inválidos');
      }
    }
    
    throw new Error('Erro ao adicionar dado de saúde');
  }
};

// Função para atualizar registro de saúde existente
export const updateHealthData = async (updatedData: HealthData): Promise<HealthData> => {
  try {
    console.log('✏️ [HealthDataUtils] Atualizando dado:', updatedData.id);
    
    const response = await axios.put(`/api/health-data/${updatedData.id}`, {
      type: updatedData.type,
      value: updatedData.value,
      secondaryValue: updatedData.secondaryValue,
      date: updatedData.date,
      notes: updatedData.notes
    }, {
      headers: getAuthHeaders()
    });

    if (response.status === 200) {
      console.log('✅ [HealthDataUtils] Dado atualizado com sucesso:', updatedData.id);
      return response.data.data;
    } else {
      throw new Error('Resposta inesperada da API');
    }
  } catch (error) {
    console.error('❌ [HealthDataUtils] Erro ao atualizar dado:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        throw new Error('Sessão expirada');
      } else if (error.response?.status === 404) {
        throw new Error('Dado não encontrado');
      } else if (error.response?.status === 400) {
        throw new Error('Dados inválidos');
      }
    }
    
    throw new Error('Erro ao atualizar dado de saúde');
  }
};

// Função para deletar registro de saúde
export const deleteHealthData = async (id: string): Promise<void> => {
  try {
    console.log('🗑️ [HealthDataUtils] Removendo dado:', id);
    
    const response = await axios.delete(`/api/health-data/${id}`, {
      headers: getAuthHeaders()
    });

    if (response.status === 200) {
      console.log('✅ [HealthDataUtils] Dado removido com sucesso:', id);
    } else {
      throw new Error('Resposta inesperada da API');
    }
  } catch (error) {
    console.error('❌ [HealthDataUtils] Erro ao remover dado:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        throw new Error('Sessão expirada');
      } else if (error.response?.status === 404) {
        throw new Error('Dado não encontrado');
      }
    }
    
    throw new Error('Erro ao remover dado de saúde');
  }
};

// Função para gerar dados de exemplo (para demonstração)
export const generateSampleHealthData = async (): Promise<void> => {
  try {
    console.log('🌱 [HealthDataUtils] Gerando dados de exemplo...');
    
    const response = await axios.put('/api/health-data', 
      { action: 'generateSample' },
      { headers: getAuthHeaders() }
    );

    if (response.status === 200) {
      console.log('✅ [HealthDataUtils] Dados de exemplo gerados com sucesso');
    }
  } catch (error) {
    console.error('❌ [HealthDataUtils] Erro ao gerar dados de exemplo:', error);
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      throw new Error('Sessão expirada');
    }
    
    // Não propagar erro para dados de exemplo, é opcional
    console.warn('⚠️ [HealthDataUtils] Falha ao gerar dados de exemplo, continuando...');
  }
};
