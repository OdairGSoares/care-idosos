import { prisma } from '../../../lib/prisma'
import type {
  IMedicationsData,
  IMedicationsDataWithoutId,
  IMedicationReminderUpdate,
  IMedicationTakenUpdate
} from '../../types/api'

/**
 * Serviços para gerenciamento de medicamentos com Prisma
 */
export class PrismaMedicationService {
  
  /**
   * Lista todos os medicamentos do usuário
   */
  static async getMedications(userId: string): Promise<IMedicationsData[] | null> {
    try {
      const medications = await prisma.medication.findMany({
        where: { userId },
        orderBy: { time: 'asc' }
      })

      return medications.map(med => ({
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        time: med.time,
        reminder: med.reminder,
        taken: med.taken
      }))
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error)
      return null
    }
  }

  /**
   * Busca um medicamento específico por ID
   */
  static async getMedicationById(id: string, userId: string): Promise<IMedicationsData | null> {
    try {
      const medication = await prisma.medication.findFirst({
        where: { 
          id,
          userId // Garantir que só pode acessar seus próprios medicamentos
        }
      })

      if (!medication) {
        return null
      }

      return {
        id: medication.id,
        name: medication.name,
        dosage: medication.dosage,
        time: medication.time,
        reminder: medication.reminder,
        taken: medication.taken
      }
    } catch (error) {
      console.error('Erro ao buscar medicamento por ID:', error)
      return null
    }
  }

  /**
   * Adiciona um novo medicamento
   */
  static async addMedication(medication: IMedicationsDataWithoutId, userId: string): Promise<string | null> {
    try {
      // Verificar se já existe medicamento com mesmo nome para o usuário
      const existingMedication = await prisma.medication.findFirst({
        where: {
          name: medication.name,
          userId
        }
      })

      if (existingMedication) {
        throw new Error('Medicamento já cadastrado para este usuário')
      }

      await prisma.medication.create({
        data: {
          name: medication.name,
          dosage: medication.dosage,
          time: medication.time,
          userId,
          reminder: false,
          taken: false
        }
      })

      return 'Medicamento adicionado com sucesso!'
    } catch (error) {
      console.error('Erro ao adicionar medicamento:', error)
      return null
    }
  }

  /**
   * Remove um medicamento
   */
  static async removeMedication(id: string, userId: string): Promise<string | null> {
    try {
      const medication = await prisma.medication.findFirst({
        where: { id, userId }
      })

      if (!medication) {
        throw new Error('Medicamento não encontrado')
      }

      await prisma.medication.delete({
        where: { id }
      })

      return 'Medicamento removido com sucesso!'
    } catch (error) {
      console.error('Erro ao remover medicamento:', error)
      return null
    }
  }

  /**
   * Atualiza o status de lembrete de um medicamento
   */
  static async updateMedicationReminder(
    id: string, 
    reminderData: IMedicationReminderUpdate, 
    userId: string
  ): Promise<string | null> {
    try {
      const medication = await prisma.medication.findFirst({
        where: { id, userId }
      })

      if (!medication) {
        throw new Error('Medicamento não encontrado')
      }

      await prisma.medication.update({
        where: { id },
        data: { reminder: reminderData.reminder }
      })

      return 'Lembrete atualizado com sucesso!'
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error)
      return null
    }
  }

  /**
   * Marca/desmarca um medicamento como tomado
   */
  static async updateMedicationTaken(
    id: string, 
    takenData: IMedicationTakenUpdate, 
    userId: string
  ): Promise<string | null> {
    try {
      const medication = await prisma.medication.findFirst({
        where: { id, userId }
      })

      if (!medication) {
        throw new Error('Medicamento não encontrado')
      }

      await prisma.medication.update({
        where: { id },
        data: { taken: takenData.taken }
      })

      return takenData.taken ? 'Medicamento marcado como tomado!' : 'Medicamento desmarcado!'
    } catch (error) {
      console.error('Erro ao atualizar status do medicamento:', error)
      return null
    }
  }

  /**
   * Reseta todos os medicamentos (marca todos como não tomados)
   */
  static async resetMedications(userId: string): Promise<string | null> {
    try {
      await prisma.medication.updateMany({
        where: { userId },
        data: { 
          taken: false,
          reminder: false
        }
      })

      return 'Todos os medicamentos foram resetados!'
    } catch (error) {
      console.error('Erro ao resetar medicamentos:', error)
      return null
    }
  }

  /**
   * Deleta todos os medicamentos de um usuário
   */
  static async deleteAllMedications(userId: string): Promise<string | null> {
    try {
      // Contar quantos medicamentos serão deletados
      const count = await prisma.medication.count({
        where: { userId }
      })

      if (count === 0) {
        return 'Usuário não possui medicamentos para remover'
      }

      // Deletar todos os medicamentos do usuário
      await prisma.medication.deleteMany({
        where: { userId }
      })

      return `${count} medicamento(s) removido(s) com sucesso!`
    } catch (error) {
      console.error('Erro ao deletar todos os medicamentos:', error)
      return null
    }
  }

  /**
   * Busca medicamentos por horário
   */
  static async getMedicationsByTime(userId: string, time: string): Promise<IMedicationsData[] | null> {
    try {
      const medications = await prisma.medication.findMany({
        where: { 
          userId,
          time
        },
        orderBy: { name: 'asc' }
      })

      return medications.map(med => ({
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        time: med.time,
        reminder: med.reminder,
        taken: med.taken
      }))
    } catch (error) {
      console.error('Erro ao buscar medicamentos por horário:', error)
      return null
    }
  }

  /**
   * Busca medicamentos com lembretes ativos
   */
  static async getMedicationsWithReminders(userId: string): Promise<IMedicationsData[] | null> {
    try {
      const medications = await prisma.medication.findMany({
        where: { 
          userId,
          reminder: true
        },
        orderBy: { time: 'asc' }
      })

      return medications.map(med => ({
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        time: med.time,
        reminder: med.reminder,
        taken: med.taken
      }))
    } catch (error) {
      console.error('Erro ao buscar medicamentos com lembretes:', error)
      return null
    }
  }
} 