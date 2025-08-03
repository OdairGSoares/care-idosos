
import { toast } from 'sonner';
import type { ApiResponse, ApiError } from '@/types/api';

// Use a URL base correta que está configurada no proxy
const BASE_URL = 'https://elderly-care-api.onrender.com';

// Função para obter o token de autenticação
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Função para criar headers comuns
const createHeaders = (includeAuth: boolean = true): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Função para tratar respostas da API
const handleApiResponse = async <T>(
  response: Response,
  showSuccessToast: boolean = false,
  successMessage?: string
): Promise<T | null> => {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.message || `Erro HTTP: ${response.status}`;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (showSuccessToast) {
      toast.success(successMessage || data.message || 'Operação realizada com sucesso');
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro ao processar resposta da API');
  }
};

// Função para tratar erros
const handleApiError = (error: unknown, operation: string): null => {
  console.error(`API Error (${operation}):`, error);
  
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('Erro de conexão com o servidor');
  }
  
  return null;
};

// Generic GET request function
export async function get<T>(
  endpoint: string, 
  requireAuth: boolean = true
): Promise<T | null> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: createHeaders(requireAuth),
    });
    
    return await handleApiResponse<T>(response);
  } catch (error) {
    return handleApiError(error, 'GET');
  }
}

// Generic POST request function
export async function post<T, R>(
  endpoint: string, 
  body: T, 
  requireAuth: boolean = true,
  showSuccessToast: boolean = true,
  successMessage?: string
): Promise<R | null> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: createHeaders(requireAuth),
      body: JSON.stringify(body),
    });
    
    return await handleApiResponse<R>(response, showSuccessToast, successMessage);
  } catch (error) {
    return handleApiError(error, 'POST');
  }
}

// Generic PUT request function
export async function put<T, R>(
  endpoint: string, 
  body: T, 
  requireAuth: boolean = true,
  showSuccessToast: boolean = true,
  successMessage?: string
): Promise<R | null> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: createHeaders(requireAuth),
      body: JSON.stringify(body),
    });
    
    return await handleApiResponse<R>(response, showSuccessToast, successMessage);
  } catch (error) {
    return handleApiError(error, 'PUT');
  }
}

// Generic DELETE request function
export async function del<R>(
  endpoint: string, 
  requireAuth: boolean = true,
  showSuccessToast: boolean = true,
  successMessage?: string
): Promise<R | null> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: createHeaders(requireAuth),
    });
    
    return await handleApiResponse<R>(response, showSuccessToast, successMessage);
  } catch (error) {
    return handleApiError(error, 'DELETE');
  }
}

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Função para fazer logout
export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  toast.success('Logout realizado com sucesso');
};
