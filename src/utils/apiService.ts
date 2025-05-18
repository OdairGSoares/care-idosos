
import { toast } from 'sonner';

const BASE_URL = 'https://elderly-care.onrender.com';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Generic GET request function
export async function get<T>(endpoint: string): Promise<T | null> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    const data: ApiResponse<T> = await response.json();
    
    if (!response.ok) {
      toast.error(data.message || 'Erro ao buscar dados');
      return null;
    }
    
    return data.data as T;
  } catch (error) {
    console.error('API Error:', error);
    toast.error('Erro de conexão com o servidor');
    return null;
  }
}

// Generic POST request function
export async function post<T, R>(endpoint: string, body: T): Promise<R | null> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    
    const data: ApiResponse<R> = await response.json();
    
    if (!response.ok) {
      toast.error(data.message || 'Erro ao enviar dados');
      return null;
    }
    
    toast.success(data.message || 'Operação realizada com sucesso');
    return data.data as R;
  } catch (error) {
    console.error('API Error:', error);
    toast.error('Erro de conexão com o servidor');
    return null;
  }
}

// Generic PUT request function
export async function put<T, R>(endpoint: string, body: T): Promise<R | null> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    
    const data: ApiResponse<R> = await response.json();
    
    if (!response.ok) {
      toast.error(data.message || 'Erro ao atualizar dados');
      return null;
    }
    
    toast.success(data.message || 'Atualizado com sucesso');
    return data.data as R;
  } catch (error) {
    console.error('API Error:', error);
    toast.error('Erro de conexão com o servidor');
    return null;
  }
}

// Generic DELETE request function
export async function del<R>(endpoint: string): Promise<R | null> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    const data: ApiResponse<R> = await response.json();
    
    if (!response.ok) {
      toast.error(data.message || 'Erro ao excluir dados');
      return null;
    }
    
    toast.success(data.message || 'Excluído com sucesso');
    return data.data as R;
  } catch (error) {
    console.error('API Error:', error);
    toast.error('Erro de conexão com o servidor');
    return null;
  }
}
