
import { get, post, put, del } from './apiService';

// Define o tipo para um contato de emergência
export interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
  isMainContact: boolean;
}

// Função para obter todos os contatos de emergência
export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
  const contacts = await get<EmergencyContact[]>('/contacts');
  return contacts || [];
};

// Função para obter um contato específico
export const getEmergencyContact = async (id: number): Promise<EmergencyContact | null> => {
  return await get<EmergencyContact>(`/contacts/${id}`);
};

// Função para adicionar um novo contato de emergência
export const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact | null> => {
  return await post<Omit<EmergencyContact, 'id'>, EmergencyContact>('/contacts', contact);
};

// Função para atualizar um contato de emergência existente
export const updateEmergencyContact = async (contact: EmergencyContact): Promise<EmergencyContact | null> => {
  return await put<EmergencyContact, EmergencyContact>(`/contacts/${contact.id}`, contact);
};

// Função para excluir um contato de emergência
export const deleteEmergencyContact = async (id: number): Promise<boolean> => {
  const result = await del(`/contacts/${id}`);
  return result !== null;
};
