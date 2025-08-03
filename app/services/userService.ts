import { toast } from 'sonner';
import type { 
  IUserData,
  IUserDataWithoutUserId,
  IUserDataWithoutPassword,
  IUserDataLogin,
  IUserToken
} from '@/types/api';

/**
 * Serviços para gerenciamento de usuários - usando API routes do Next.js
 */
export class UserService {
  
  /**
   * Cadastra um novo usuário
   */
  static async signUp(userData: IUserDataWithoutUserId): Promise<IUserData | null> {
    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar usuário');
      }

      toast.success('Usuário cadastrado com sucesso!');
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar usuário';
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Realiza login do usuário
   */
  static async login(credentials: IUserDataLogin): Promise<IUserToken | null> {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      // Salvar token e userId automaticamente no localStorage
      if (data.token && data.userId) {
        UserService.saveAuthToken(data.token, data.userId);
      }

      toast.success('Login realizado com sucesso!');
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Lista todos os usuários
   */
  static async getUsers(): Promise<IUserDataWithoutPassword[] | null> {
    try {
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return null;
    }
  }

  /**
   * Busca um usuário específico por ID
   */
  static async getUserById(userId: string): Promise<IUserDataWithoutPassword | null> {
    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar usuário');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  // =====================================================
  // FUNÇÕES SEGURAS PARA O BROWSER (sem Prisma)
  // =====================================================

  /**
   * Salva o token de autenticação no localStorage
   */
  static saveAuthToken(token: string, userId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
    }
  }

  /**
   * Remove o token de autenticação do localStorage
   */
  static removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    }
  }

  /**
   * Obtém o ID do usuário logado
   */
  static getCurrentUserId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId');
    }
    return null;
  }

  /**
   * Verifica se há um usuário logado
   */
  static isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken') && !!localStorage.getItem('userId');
    }
    return false;
  }
} 