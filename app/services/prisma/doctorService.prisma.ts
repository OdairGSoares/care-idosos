import { prisma } from '../../../lib/prisma'
import type { IDoctorsData } from '../../types/api'

/**
 * Serviços para gerenciamento de médicos com Prisma
 */
export class PrismaDoctorService {
  
  /**
   * Lista todos os médicos disponíveis
   */
  static async getDoctors(): Promise<IDoctorsData[] | null> {
    try {
      const doctors = await prisma.doctor.findMany({
        orderBy: { name: 'asc' }
      })

      return doctors.map(doctor => ({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        image: doctor.image ?? undefined,
      }))
    } catch (error) {
      console.error('Erro ao buscar médicos:', error)
      return null
    }
  }

  /**
   * Busca um médico específico por ID
   */
  static async getDoctorById(doctorId: string): Promise<IDoctorsData | null> {
    try {
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId }
      })

      if (!doctor) {
        return null
      }

      return {
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        image: doctor.image ?? undefined
      }
    } catch (error) {
      console.error('Erro ao buscar médico por ID:', error)
      return null
    }
  }

  /**
   * Busca médicos por especialidade
   */
  static async getDoctorsBySpecialty(specialty: string): Promise<IDoctorsData[] | null> {
    try {
      const doctors = await prisma.doctor.findMany({
        where: {
          specialty: {
            contains: specialty,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      })

      return doctors.map(doctor => ({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        image: doctor.image ?? undefined
      }))
    } catch (error) {
      console.error('Erro ao buscar médicos por especialidade:', error)
      return null
    }
  }

  /**
   * Busca médicos por nome
   */
  static async getDoctorsByName(name: string): Promise<IDoctorsData[] | null> {
    try {
      const doctors = await prisma.doctor.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      })

      return doctors.map(doctor => ({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        image: doctor.image ?? undefined
      }))
    } catch (error) {
      console.error('Erro ao buscar médicos por nome:', error)
      return null
    }
  }

  /**
   * Obtém lista de todas as especialidades disponíveis
   */
  static async getSpecialties(): Promise<string[] | null> {
    try {
      const result = await prisma.doctor.findMany({
        select: { specialty: true },
        distinct: ['specialty'],
        orderBy: { specialty: 'asc' }
      })

      return result.map(item => item.specialty)
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error)
      return null
    }
  }

  /**
   * Adiciona um novo médico (função administrativa)
   */
  static async addDoctor(doctorData: Omit<IDoctorsData, 'doctorId'>): Promise<string | null> {
    try {
      await prisma.doctor.create({
        data: {
          name: doctorData.doctorName,
          specialty: doctorData.specialty,
          image: doctorData.image
        }
      })

      return 'Médico adicionado com sucesso!'
    } catch (error) {
      console.error('Erro ao adicionar médico:', error)
      return null
    }
  }

  /**
   * Atualiza dados de um médico (função administrativa)
   */
  static async updateDoctor(doctorId: string, doctorData: Partial<Omit<IDoctorsData, 'doctorId'>>): Promise<string | null> {
    try {
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId }
      })

      if (!doctor) {
        throw new Error('Médico não encontrado')
      }

      const updateData: any = {}
      if (doctorData.doctorName) updateData.name = doctorData.doctorName
      if (doctorData.specialty) updateData.specialty = doctorData.specialty
      if (doctorData.image !== undefined) updateData.image = doctorData.image

      await prisma.doctor.update({
        where: { id: doctorId },
        data: updateData
      })

      return 'Médico atualizado com sucesso!'
    } catch (error) {
      console.error('Erro ao atualizar médico:', error)
      return null
    }
  }

  /**
   * Remove um médico (função administrativa)
   */
  static async removeDoctor(doctorId: string): Promise<string | null> {
    try {
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId }
      })

      if (!doctor) {
        throw new Error('Médico não encontrado')
      }

      // Verificar se há agendamentos para este médico
      const appointmentsCount = await prisma.appointment.count({
        where: { doctorId }
      })

      if (appointmentsCount > 0) {
        throw new Error('Não é possível remover médico com agendamentos ativos')
      }

      await prisma.doctor.delete({
        where: { id: doctorId }
      })

      return 'Médico removido com sucesso!'
    } catch (error) {
      console.error('Erro ao remover médico:', error)
      return null
    }
  }

  /**
   * Busca médicos com agendamentos em uma data específica
   */
  static async getDoctorsWithAppointments(date: string): Promise<IDoctorsData[] | null> {
    try {
      const doctors = await prisma.doctor.findMany({
        where: {
          appointments: {
            some: {
              date: date
            }
          }
        },
        orderBy: { name: 'asc' }
      })

      return doctors.map(doctor => ({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        image: doctor.image ?? undefined
      }))
    } catch (error) {
      console.error('Erro ao buscar médicos com agendamentos:', error)
      return null
    }
  }
} 