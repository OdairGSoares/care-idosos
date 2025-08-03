import { get, post, put, del } from '@/utils/apiService';
import type { 
  IContactsData,
  IContactsDataWithoutId
} from '@/types/api';

/**
 * Serviços para gerenciamento de contatos de emergência
 */
export class EmergencyContactService {
  
  /**
   * Lista todos os contatos de emergência do usuário logado
   */
  static async getEmergencyContacts(): Promise<IContactsData[] | null> {
    return get<IContactsData[]>('/contacts');
  }

  /**
   * Busca um contato de emergência específico por ID
   */
  static async getEmergencyContactById(id: string): Promise<IContactsData | null> {
    return get<IContactsData>(`/contacts/${id}`);
  }

  /**
   * Adiciona um novo contato de emergência
   */
  static async addEmergencyContact(contact: IContactsDataWithoutId): Promise<string | null> {
    return post<IContactsDataWithoutId, string>(
      '/contacts',
      contact,
      true,
      true,
      'Contato de emergência adicionado com sucesso!'
    );
  }

  /**
   * Atualiza um contato de emergência existente
   */
  static async updateEmergencyContact(
    id: string, 
    contact: IContactsDataWithoutId
  ): Promise<string | null> {
    return put<IContactsDataWithoutId, string>(
      `/contacts/${id}`,
      contact,
      true,
      true,
      'Contato de emergência atualizado com sucesso!'
    );
  }

  /**
   * Remove um contato de emergência
   */
  static async removeEmergencyContact(id: string): Promise<string | null> {
    return del<string>(
      `/contacts/${id}`,
      true,
      true,
      'Contato de emergência removido com sucesso!'
    );
  }

  /**
   * Busca o contato principal de emergência
   */
  static async getMainContact(): Promise<IContactsData | null> {
    const contacts = await this.getEmergencyContacts();
    if (!contacts) return null;
    
    return contacts.find(contact => contact.isMainContact) || null;
  }

  /**
   * Busca contatos por tipo de relacionamento
   */
  static async getContactsByRelationship(relationship: string): Promise<IContactsData[] | null> {
    const contacts = await this.getEmergencyContacts();
    if (!contacts) return null;
    
    return contacts.filter(contact => 
      contact.relationship.toLowerCase().includes(relationship.toLowerCase())
    );
  }
} 