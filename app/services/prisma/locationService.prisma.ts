import { prisma } from '../../../lib/prisma'
import type { ILocationData } from '../../types/api'

/**
 * Serviços para gerenciamento de localizações/clínicas com Prisma
 */
export class PrismaLocationService {
  
  /**
   * Lista todas as localizações/clínicas disponíveis
   */
  static async getLocations(): Promise<ILocationData[] | null> {
    try {
      const locations = await prisma.location.findMany({
        orderBy: { name: 'asc' }
      })

      return locations.map(location => ({
        locationId: location.id,
        locationName: location.name,
        locationAddress: location.address,
        locationCity: location.city
      }))
    } catch (error) {
      console.error('Erro ao buscar localizações:', error)
      return null
    }
  }

  /**
   * Busca uma localização específica por ID
   */
  static async getLocationById(locationId: string): Promise<ILocationData | null> {
    try {
      const location = await prisma.location.findUnique({
        where: { id: locationId }
      })

      if (!location) {
        return null
      }

      return {
        locationId: location.id,
        locationName: location.name,
        locationAddress: location.address,
        locationCity: location.city
      }
    } catch (error) {
      console.error('Erro ao buscar localização por ID:', error)
      return null
    }
  }

  /**
   * Busca localizações por cidade
   */
  static async getLocationsByCity(city: string): Promise<ILocationData[] | null> {
    try {
      const locations = await prisma.location.findMany({
        where: {
          city: {
            contains: city,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      })

      return locations.map(location => ({
        locationId: location.id,
        locationName: location.name,
        locationAddress: location.address,
        locationCity: location.city
      }))
    } catch (error) {
      console.error('Erro ao buscar localizações por cidade:', error)
      return null
    }
  }

  /**
   * Busca localizações por nome
   */
  static async getLocationsByName(name: string): Promise<ILocationData[] | null> {
    try {
      const locations = await prisma.location.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      })

      return locations.map(location => ({
        locationId: location.id,
        locationName: location.name,
        locationAddress: location.address,
        locationCity: location.city
      }))
    } catch (error) {
      console.error('Erro ao buscar localizações por nome:', error)
      return null
    }
  }

  /**
   * Obtém lista de todas as cidades disponíveis
   */
  static async getCities(): Promise<string[] | null> {
    try {
      const result = await prisma.location.findMany({
        select: { city: true },
        distinct: ['city'],
        orderBy: { city: 'asc' }
      })

      return result.map(item => item.city)
    } catch (error) {
      console.error('Erro ao buscar cidades:', error)
      return null
    }
  }

  /**
   * Adiciona uma nova localização (função administrativa)
   */
  static async addLocation(locationData: Omit<ILocationData, 'locationId'>): Promise<string | null> {
    try {
      await prisma.location.create({
        data: {
          name: locationData.locationName,
          address: locationData.locationAddress,
          city: locationData.locationCity
        }
      })

      return 'Localização adicionada com sucesso!'
    } catch (error) {
      console.error('Erro ao adicionar localização:', error)
      return null
    }
  }

  /**
   * Atualiza dados de uma localização (função administrativa)
   */
  static async updateLocation(locationId: string, locationData: Partial<Omit<ILocationData, 'locationId'>>): Promise<string | null> {
    try {
      const location = await prisma.location.findUnique({
        where: { id: locationId }
      })

      if (!location) {
        throw new Error('Localização não encontrada')
      }

      const updateData: any = {}
      if (locationData.locationName) updateData.name = locationData.locationName
      if (locationData.locationAddress) updateData.address = locationData.locationAddress
      if (locationData.locationCity) updateData.city = locationData.locationCity

      await prisma.location.update({
        where: { id: locationId },
        data: updateData
      })

      return 'Localização atualizada com sucesso!'
    } catch (error) {
      console.error('Erro ao atualizar localização:', error)
      return null
    }
  }

  /**
   * Remove uma localização (função administrativa)
   */
  static async removeLocation(locationId: string): Promise<string | null> {
    try {
      const location = await prisma.location.findUnique({
        where: { id: locationId }
      })

      if (!location) {
        throw new Error('Localização não encontrada')
      }

      // Verificar se há agendamentos para esta localização
      const appointmentsCount = await prisma.appointment.count({
        where: { locationId }
      })

      if (appointmentsCount > 0) {
        throw new Error('Não é possível remover localização com agendamentos ativos')
      }

      await prisma.location.delete({
        where: { id: locationId }
      })

      return 'Localização removida com sucesso!'
    } catch (error) {
      console.error('Erro ao remover localização:', error)
      return null
    }
  }

  /**
   * Busca localizações com agendamentos em uma data específica
   */
  static async getLocationsWithAppointments(date: string): Promise<ILocationData[] | null> {
    try {
      const locations = await prisma.location.findMany({
        where: {
          appointments: {
            some: {
              date: date
            }
          }
        },
        orderBy: { name: 'asc' }
      })

      return locations.map(location => ({
        locationId: location.id,
        locationName: location.name,
        locationAddress: location.address,
        locationCity: location.city
      }))
    } catch (error) {
      console.error('Erro ao buscar localizações com agendamentos:', error)
      return null
    }
  }

  /**
   * Busca localizações por endereço
   */
  static async getLocationsByAddress(address: string): Promise<ILocationData[] | null> {
    try {
      const locations = await prisma.location.findMany({
        where: {
          address: {
            contains: address,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      })

      return locations.map(location => ({
        locationId: location.id,
        locationName: location.name,
        locationAddress: location.address,
        locationCity: location.city
      }))
    } catch (error) {
      console.error('Erro ao buscar localizações por endereço:', error)
      return null
    }
  }
} 