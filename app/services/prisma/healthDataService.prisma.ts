import { prisma } from '../../../lib/prisma'

export type HealthDataType = 'bloodPressure' | 'heartRate' | 'glucose' | 'weight' | 'temperature'

export interface IHealthData {
  id: string
  type: HealthDataType
  value: number
  secondaryValue?: number
  date: string
  notes?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface IHealthDataWithoutId {
  type: HealthDataType
  value: number
  secondaryValue?: number
  date: string
  notes?: string
}

/**
 * Serviços para gerenciamento de dados de saúde com Prisma
 */
export class PrismaHealthDataService {
  
  /**
   * Lista todos os dados de saúde do usuário
   */
  static async getAllHealthData(userId: string): Promise<IHealthData[]> {
    try {
      console.log('🔍 [HealthDataService] Buscando todos os dados de saúde para usuário:', userId)
      
      // Usar SQL direto para contornar problema do cliente Prisma
      const healthData = await prisma.$queryRaw`
        SELECT id, type, value, "secondaryValue", date, notes, "userId", "createdAt", "updatedAt"
        FROM health_data 
        WHERE "userId" = ${userId}
        ORDER BY date DESC, "createdAt" DESC
      ` as any[]

      console.log('✅ [HealthDataService] Dados encontrados:', healthData.length)
      return healthData.map(data => ({
        id: data.id,
        type: data.type as HealthDataType,
        value: parseFloat(data.value),
        secondaryValue: data.secondaryValue ? parseFloat(data.secondaryValue) : undefined,
        date: data.date,
        notes: data.notes || undefined,
        userId: data.userId,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      }))
    } catch (error) {
      console.error('❌ [HealthDataService] Erro ao buscar dados de saúde:', error)
      throw error
    }
  }

  /**
   * Lista dados de saúde por tipo
   */
  static async getHealthDataByType(userId: string, type: HealthDataType): Promise<IHealthData[]> {
    try {
      console.log('🔍 [HealthDataService] Buscando dados de saúde por tipo:', type, 'para usuário:', userId)
      
      // Usar SQL direto para contornar problema do cliente Prisma
      const healthData = await prisma.$queryRaw`
        SELECT id, type, value, "secondaryValue", date, notes, "userId", "createdAt", "updatedAt"
        FROM health_data 
        WHERE "userId" = ${userId} AND type = ${type}
        ORDER BY date DESC, "createdAt" DESC
      ` as any[]

      console.log('✅ [HealthDataService] Dados por tipo encontrados:', healthData.length)
      return healthData.map(data => ({
        id: data.id,
        type: data.type as HealthDataType,
        value: parseFloat(data.value),
        secondaryValue: data.secondaryValue ? parseFloat(data.secondaryValue) : undefined,
        date: data.date,
        notes: data.notes || undefined,
        userId: data.userId,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      }))
    } catch (error) {
      console.error('❌ [HealthDataService] Erro ao buscar dados por tipo:', error)
      throw error
    }
  }

  /**
   * Busca um dado de saúde específico por ID
   */
  static async getHealthDataById(id: string, userId: string): Promise<IHealthData | null> {
    try {
      console.log('🔍 [HealthDataService] Buscando dado de saúde ID:', id)
      
      // Usar SQL direto para contornar problema do cliente Prisma
      const healthData = await prisma.$queryRaw`
        SELECT id, type, value, "secondaryValue", date, notes, "userId", "createdAt", "updatedAt"
        FROM health_data 
        WHERE id = ${id} AND "userId" = ${userId}
        LIMIT 1
      ` as any[]

      if (healthData.length === 0) {
        console.log('❌ [HealthDataService] Dado de saúde não encontrado')
        return null
      }

      const data = healthData[0]
      return {
        id: data.id,
        type: data.type as HealthDataType,
        value: parseFloat(data.value),
        secondaryValue: data.secondaryValue ? parseFloat(data.secondaryValue) : undefined,
        date: data.date,
        notes: data.notes || undefined,
        userId: data.userId,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      }
    } catch (error) {
      console.error('❌ [HealthDataService] Erro ao buscar dado por ID:', error)
      throw error
    }
  }

  /**
   * Adiciona um novo dado de saúde
   */
  static async addHealthData(data: IHealthDataWithoutId, userId: string): Promise<IHealthData> {
    try {
      console.log('➕ [HealthDataService] Criando novo dado de saúde:', data)
      
      // Gerar ID único usando timestamp e random
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 1000000)
      const id = `health_${timestamp}_${random}`
      
      // Usar SQL direto para contornar problema do cliente Prisma
      const result = await prisma.$queryRaw`
        INSERT INTO health_data (id, type, value, "secondaryValue", date, notes, "userId", "createdAt", "updatedAt")
        VALUES (${id}, ${data.type}, ${data.value}, ${data.secondaryValue || null}, ${data.date}, ${data.notes || null}, ${userId}, NOW(), NOW())
        RETURNING id, type, value, "secondaryValue", date, notes, "userId", "createdAt", "updatedAt"
      ` as any[]

      const healthData = result[0]
      console.log('✅ [HealthDataService] Dado criado com sucesso:', healthData.id)
      
      return {
        id: healthData.id,
        type: healthData.type as HealthDataType,
        value: parseFloat(healthData.value),
        secondaryValue: healthData.secondaryValue ? parseFloat(healthData.secondaryValue) : undefined,
        date: healthData.date,
        notes: healthData.notes || undefined,
        userId: healthData.userId,
        createdAt: new Date(healthData.createdAt),
        updatedAt: new Date(healthData.updatedAt)
      }
    } catch (error) {
      console.error('❌ [HealthDataService] Erro ao criar dado de saúde:', error)
      throw error
    }
  }

  /**
   * Atualiza um dado de saúde existente
   */
  static async updateHealthData(
    id: string, 
    data: IHealthDataWithoutId, 
    userId: string
  ): Promise<IHealthData | null> {
    try {
      console.log('✏️ [HealthDataService] Atualizando dado de saúde:', id, data)
      
      // Verificar se o dado existe e pertence ao usuário
      const existingData = await prisma.$queryRaw`
        SELECT id FROM health_data WHERE id = ${id} AND "userId" = ${userId}
        LIMIT 1
      ` as any[]

      if (existingData.length === 0) {
        console.log('❌ [HealthDataService] Dado não encontrado ou não pertence ao usuário')
        return null
      }

      // Atualizar o dado
      const result = await prisma.$queryRaw`
        UPDATE health_data 
        SET type = ${data.type}, value = ${data.value}, "secondaryValue" = ${data.secondaryValue || null}, 
            date = ${data.date}, notes = ${data.notes || null}, "updatedAt" = NOW()
        WHERE id = ${id}
        RETURNING id, type, value, "secondaryValue", date, notes, "userId", "createdAt", "updatedAt"
      ` as any[]

      const updatedData = result[0]
      console.log('✅ [HealthDataService] Dado atualizado com sucesso:', id)
      
      return {
        id: updatedData.id,
        type: updatedData.type as HealthDataType,
        value: parseFloat(updatedData.value),
        secondaryValue: updatedData.secondaryValue ? parseFloat(updatedData.secondaryValue) : undefined,
        date: updatedData.date,
        notes: updatedData.notes || undefined,
        userId: updatedData.userId,
        createdAt: new Date(updatedData.createdAt),
        updatedAt: new Date(updatedData.updatedAt)
      }
    } catch (error) {
      console.error('❌ [HealthDataService] Erro ao atualizar dado:', error)
      throw error
    }
  }

  /**
   * Remove um dado de saúde
   */
  static async deleteHealthData(id: string, userId: string): Promise<boolean> {
    try {
      console.log('🗑️ [HealthDataService] Removendo dado de saúde:', id)
      
      // Verificar se o dado existe e pertence ao usuário
      const existingData = await prisma.$queryRaw`
        SELECT id FROM health_data WHERE id = ${id} AND "userId" = ${userId}
        LIMIT 1
      ` as any[]

      if (existingData.length === 0) {
        console.log('❌ [HealthDataService] Dado não encontrado ou não pertence ao usuário')
        return false
      }

      // Remover o dado
      await prisma.$executeRaw`
        DELETE FROM health_data WHERE id = ${id}
      `

      console.log('✅ [HealthDataService] Dado removido com sucesso:', id)
      return true
    } catch (error) {
      console.error('❌ [HealthDataService] Erro ao remover dado:', error)
      throw error
    }
  }

  /**
   * Busca dados de saúde por período
   */
  static async getHealthDataByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
    type?: HealthDataType
  ): Promise<IHealthData[]> {
    try {
      console.log('📅 [HealthDataService] Buscando dados por período:', { startDate, endDate, type })
      
      let query: string
      let params: any[]
      
      if (type) {
        query = `
          SELECT id, type, value, "secondaryValue", date, notes, "userId", "createdAt", "updatedAt"
          FROM health_data 
          WHERE "userId" = $1 AND type = $2 AND date >= $3 AND date <= $4
          ORDER BY date ASC, "createdAt" ASC
        `
        params = [userId, type, startDate, endDate]
      } else {
        query = `
          SELECT id, type, value, "secondaryValue", date, notes, "userId", "createdAt", "updatedAt"
          FROM health_data 
          WHERE "userId" = $1 AND date >= $2 AND date <= $3
          ORDER BY date ASC, "createdAt" ASC
        `
        params = [userId, startDate, endDate]
      }

      const healthData = await prisma.$queryRawUnsafe(query, ...params) as any[]

      console.log('✅ [HealthDataService] Dados por período encontrados:', healthData.length)
      return healthData.map(data => ({
        id: data.id,
        type: data.type as HealthDataType,
        value: parseFloat(data.value),
        secondaryValue: data.secondaryValue ? parseFloat(data.secondaryValue) : undefined,
        date: data.date,
        notes: data.notes || undefined,
        userId: data.userId,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      }))
    } catch (error) {
      console.error('❌ [HealthDataService] Erro ao buscar dados por período:', error)
      throw error
    }
  }

  /**
   * Gera dados de exemplo para demonstração
   */
  static async generateSampleData(userId: string): Promise<void> {
    try {
      console.log('🌱 [HealthDataService] Gerando dados de exemplo para usuário:', userId)
      
      // Verificar se já existem dados
      const existingData = await prisma.$queryRaw`
        SELECT id FROM health_data WHERE "userId" = ${userId} LIMIT 1
      ` as any[]

      if (existingData.length > 0) {
        console.log('ℹ️ [HealthDataService] Usuário já possui dados, pulando geração de exemplo')
        return
      }

      const today = new Date()
      const sampleData: Array<{
        type: string
        value: number
        secondaryValue?: number
        date: string
        userId: string
      }> = []
      
      // Gerar dados dos últimos 7 dias
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        // Pressão arterial (sistólica/diastólica)
        sampleData.push({
          type: 'bloodPressure',
          value: Math.floor(Math.random() * 20) + 110, // Sistólica entre 110-130
          secondaryValue: Math.floor(Math.random() * 15) + 70, // Diastólica entre 70-85
          date: dateStr,
          userId
        })
        
        // Frequência cardíaca
        sampleData.push({
          type: 'heartRate',
          value: Math.floor(Math.random() * 20) + 65, // Entre 65-85
          date: dateStr,
          userId
        })
        
        // Glicose
        sampleData.push({
          type: 'glucose',
          value: Math.floor(Math.random() * 40) + 80, // Entre 80-120
          date: dateStr,
          userId
        })
        
        // Peso (a cada dois dias)
        if (i % 2 === 0) {
          sampleData.push({
            type: 'weight',
            value: Math.round((Math.random() * 5 + 70) * 10) / 10, // Entre 70-75kg
            date: dateStr,
            userId
          })
        }
        
        // Temperatura (a cada três dias)
        if (i % 3 === 0) {
          sampleData.push({
            type: 'temperature',
            value: Math.round((Math.random() * 1 + 36) * 10) / 10, // Entre 36-37°C
            date: dateStr,
            userId
          })
        }
      }
      
      // Criar todos os dados de exemplo usando SQL
      for (const data of sampleData) {
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 1000000)
        const id = `health_${timestamp}_${random}`
        
        await prisma.$executeRaw`
          INSERT INTO health_data (id, type, value, "secondaryValue", date, "userId", "createdAt", "updatedAt")
          VALUES (${id}, ${data.type}, ${data.value}, ${data.secondaryValue || null}, ${data.date}, ${data.userId}, NOW(), NOW())
        `
      }

      console.log('✅ [HealthDataService] Dados de exemplo criados:', sampleData.length)
    } catch (error) {
      console.error('❌ [HealthDataService] Erro ao gerar dados de exemplo:', error)
      throw error
    }
  }
} 