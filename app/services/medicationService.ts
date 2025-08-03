import { get, post, put, del } from '@/utils/apiService';
import type { 
  IMedicationsData,
  IMedicationsDataWithoutId,
  IMedicationReminderUpdate,
  IMedicationTakenUpdate
} from '@/types/api';

/**
 * Serviços para gerenciamento de medicamentos
 */
export class MedicationService {
  
  /**
   * Lista todos os medicamentos do usuário logado
   */
  static async getMedications(): Promise<IMedicationsData[] | null> {
    return get<IMedicationsData[]>('/medication');
  }

  /**
   * Busca um medicamento específico por ID
   */
  static async getMedicationById(id: string): Promise<IMedicationsData | null> {
    return get<IMedicationsData>(`/medication/${id}`);
  }

  /**
   * Adiciona um novo medicamento
   */
  static async addMedication(medication: IMedicationsDataWithoutId): Promise<string | null> {
    return post<IMedicationsDataWithoutId, string>(
      '/medication',
      medication,
      true,
      true,
      'Medicamento adicionado com sucesso!'
    );
  }

  /**
   * Remove um medicamento
   */
  static async removeMedication(id: string): Promise<string | null> {
    return del<string>(
      `/medication/${id}`,
      true,
      true,
      'Medicamento removido com sucesso!'
    );
  }

  /**
   * Atualiza o status de lembrete de um medicamento
   */
  static async updateMedicationReminder(
    id: string, 
    reminderData: IMedicationReminderUpdate
  ): Promise<string | null> {
    return put<IMedicationReminderUpdate, string>(
      `/medication/reminder/${id}`,
      reminderData,
      true,
      true,
      'Lembrete atualizado com sucesso!'
    );
  }

  /**
   * Marca/desmarca um medicamento como tomado
   */
  static async updateMedicationTaken(
    id: string, 
    takenData: IMedicationTakenUpdate
  ): Promise<string | null> {
    return put<IMedicationTakenUpdate, string>(
      `/medication/taken/${id}`,
      takenData,
      true,
      true,
      takenData.taken ? 'Medicamento marcado como tomado!' : 'Medicamento desmarcado!'
    );
  }

  /**
   * Reseta todos os medicamentos (marca todos como não tomados)
   */
  static async resetMedications(): Promise<string | null> {
    return put<{}, string>(
      '/medication/reset',
      {},
      true,
      true,
      'Todos os medicamentos foram resetados!'
    );
  }
} 