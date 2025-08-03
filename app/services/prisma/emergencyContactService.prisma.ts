import { prisma } from '../../../lib/prisma'
import type {
  IContactsData,
  IContactsDataWithoutId
} from '../../types/api'

/**
 * Serviços para gerenciamento de contatos de emergência com Prisma
 */
export class PrismaEmergencyContactService {
  
  /**
   * Lista todos os contatos de emergência do usuário
   */
  static async getEmergencyContacts(userId: string): Promise<IContactsData[] | null> {
    try {
      const contacts = await prisma.emergencyContact.findMany({
        where: { userId },
        orderBy: [
          { isMainContact: 'desc' }, // Contato principal primeiro
          { name: 'asc' }
        ]
      })

      return contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
        isMainContact: contact.isMainContact
      }))
    } catch (error) {
      console.error('Erro ao buscar contatos de emergência:', error)
      return null
    }
  }

  /**
   * Busca um contato de emergência específico por ID
   */
  static async getEmergencyContactById(id: string, userId: string): Promise<IContactsData | null> {
    try {
      const contact = await prisma.emergencyContact.findFirst({
        where: { 
          id,
          userId
        }
      })

      if (!contact) {
        return null
      }

      return {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
        isMainContact: contact.isMainContact
      }
    } catch (error) {
      console.error('Erro ao buscar contato por ID:', error)
      return null
    }
  }

  /**
   * Adiciona um novo contato de emergência
   */
  static async addEmergencyContact(contact: IContactsDataWithoutId, userId: string): Promise<string | null> {
    try {
      // Se o novo contato for marcado como principal, remover a marcação dos outros
      if (contact.isMainContact) {
        await prisma.emergencyContact.updateMany({
          where: { 
            userId,
            isMainContact: true
          },
          data: { isMainContact: false }
        })
      }

      await prisma.emergencyContact.create({
        data: {
          name: contact.name,
          phone: contact.phone,
          relationship: contact.relationship,
          isMainContact: contact.isMainContact,
          userId
        }
      })

      return 'Contato de emergência adicionado com sucesso!'
    } catch (error) {
      console.error('Erro ao adicionar contato:', error)
      return null
    }
  }

  /**
   * Atualiza um contato de emergência existente
   */
  static async updateEmergencyContact(
    id: string, 
    contact: IContactsDataWithoutId, 
    userId: string
  ): Promise<string | null> {
    try {
      const existingContact = await prisma.emergencyContact.findFirst({
        where: { id, userId }
      })

      if (!existingContact) {
        throw new Error('Contato não encontrado')
      }

      // Se está marcando como principal, remover a marcação dos outros
      if (contact.isMainContact && !existingContact.isMainContact) {
        await prisma.emergencyContact.updateMany({
          where: { 
            userId,
            isMainContact: true,
            id: { not: id } // Excluir o contato atual
          },
          data: { isMainContact: false }
        })
      }

      await prisma.emergencyContact.update({
        where: { id },
        data: {
          name: contact.name,
          phone: contact.phone,
          relationship: contact.relationship,
          isMainContact: contact.isMainContact
        }
      })

      return 'Contato de emergência atualizado com sucesso!'
    } catch (error) {
      console.error('Erro ao atualizar contato:', error)
      return null
    }
  }

  /**
   * Remove um contato de emergência
   */
  static async removeEmergencyContact(id: string, userId: string): Promise<string | null> {
    try {
      const contact = await prisma.emergencyContact.findFirst({
        where: { id, userId }
      })

      if (!contact) {
        throw new Error('Contato não encontrado')
      }

      await prisma.emergencyContact.delete({
        where: { id }
      })

      return 'Contato de emergência removido com sucesso!'
    } catch (error) {
      console.error('Erro ao remover contato:', error)
      return null
    }
  }

  /**
   * Busca o contato principal de emergência
   */
  static async getMainContact(userId: string): Promise<IContactsData | null> {
    try {
      const contact = await prisma.emergencyContact.findFirst({
        where: { 
          userId,
          isMainContact: true
        }
      })

      if (!contact) {
        return null
      }

      return {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
        isMainContact: contact.isMainContact
      }
    } catch (error) {
      console.error('Erro ao buscar contato principal:', error)
      return null
    }
  }

  /**
   * Busca contatos por tipo de relacionamento
   */
  static async getContactsByRelationship(relationship: string, userId: string): Promise<IContactsData[] | null> {
    try {
      const contacts = await prisma.emergencyContact.findMany({
        where: { 
          userId,
          relationship: {
            contains: relationship,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      })

      return contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
        isMainContact: contact.isMainContact
      }))
    } catch (error) {
      console.error('Erro ao buscar contatos por relacionamento:', error)
      return null
    }
  }

  /**
   * Define um contato como principal
   */
  static async setMainContact(id: string, userId: string): Promise<string | null> {
    try {
      const contact = await prisma.emergencyContact.findFirst({
        where: { id, userId }
      })

      if (!contact) {
        throw new Error('Contato não encontrado')
      }

      // Remover marcação principal de todos os outros
      await prisma.emergencyContact.updateMany({
        where: { 
          userId,
          isMainContact: true
        },
        data: { isMainContact: false }
      })

      // Marcar este como principal
      await prisma.emergencyContact.update({
        where: { id },
        data: { isMainContact: true }
      })

      return 'Contato principal definido com sucesso!'
    } catch (error) {
      console.error('Erro ao definir contato principal:', error)
      return null
    }
  }
} 