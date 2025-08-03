import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaAppointmentService {
  
  // Obter todas as consultas de um usuário
  static async getAppointments(userId: string) {
    try {
      console.log('🔍 Buscando consultas no Prisma para userId:', userId);
      
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: userId
        },
        include: {
          doctor: true,
          location: true
        },
        orderBy: [
          { date: 'asc' },
          { time: 'asc' }
        ]
      });

      console.log('✅ Consultas encontradas no Prisma:', appointments.length);
      return appointments;
    } catch (error) {
      console.error('❌ Erro ao buscar consultas no Prisma:', error);
      throw error;
    }
  }

  // Obter uma consulta específica por ID
  static async getAppointmentById(appointmentId: string, userId: string) {
    try {
      console.log('🔍 Buscando consulta no Prisma ID:', appointmentId);
      
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          userId: userId
        },
        include: {
          doctor: true,
          location: true
        }
      });

      return appointment;
    } catch (error) {
      console.error('❌ Erro ao buscar consulta no Prisma:', error);
      throw error;
    }
  }

  // Criar nova consulta
  static async createAppointment(appointmentData: {
    date: string;
    time: string;
    doctorId: string;
    locationId: string;
    userId: string;
  }) {
    try {
      console.log('📅 [PRISMA] Iniciando criação de consulta:', appointmentData);
      
      // Verificar se médico existe
      console.log('👨‍⚕️ [PRISMA] Verificando se médico existe:', appointmentData.doctorId);
      const doctor = await prisma.doctor.findUnique({
        where: { id: appointmentData.doctorId }
      });
      
      if (!doctor) {
        console.error('❌ [PRISMA] Médico não encontrado:', appointmentData.doctorId);
        throw new Error(`Médico com ID ${appointmentData.doctorId} não foi encontrado`);
      }
      console.log('✅ [PRISMA] Médico encontrado:', doctor.name);

      // Verificar se localização existe
      console.log('🏥 [PRISMA] Verificando se localização existe:', appointmentData.locationId);
      const location = await prisma.location.findUnique({
        where: { id: appointmentData.locationId }
      });
      
      if (!location) {
        console.error('❌ [PRISMA] Localização não encontrada:', appointmentData.locationId);
        throw new Error(`Localização com ID ${appointmentData.locationId} não foi encontrada`);
      }
      console.log('✅ [PRISMA] Localização encontrada:', location.name);

      // Verificar se usuário existe
      console.log('👤 [PRISMA] Verificando se usuário existe:', appointmentData.userId);
      const user = await prisma.user.findUnique({
        where: { id: appointmentData.userId }
      });
      
      if (!user) {
        console.error('❌ [PRISMA] Usuário não encontrado:', appointmentData.userId);
        throw new Error(`Usuário com ID ${appointmentData.userId} não foi encontrado`);
      }
      console.log('✅ [PRISMA] Usuário encontrado:', user.email);

      console.log('💾 [PRISMA] Criando registro no banco...');
      const appointment = await prisma.appointment.create({
        data: {
          date: appointmentData.date,
          time: appointmentData.time,
          doctorId: appointmentData.doctorId,
          locationId: appointmentData.locationId,
          userId: appointmentData.userId,
          confirmed: false
        },
        include: {
          doctor: true,
          location: true
        }
      });

      console.log('✅ [PRISMA] Consulta criada com sucesso:', appointment.id);
      return appointment;
    } catch (error) {
      console.error('❌ [PRISMA] ERRO DETALHADO ao criar consulta:', error);
      console.error('❌ [PRISMA] Stack trace:', error instanceof Error ? error.stack : 'N/A');
      throw error;
    }
  }

  // Atualizar consulta (confirmação, reagendamento, etc.)
  static async updateAppointment(
    appointmentId: string, 
    updateData: {
      date?: string;
      time?: string;
      confirmed?: boolean;
      doctorId?: string;
      locationId?: string;
    },
    userId: string
  ) {
    try {
      console.log('✏️ Atualizando consulta no Prisma:', appointmentId, updateData);
      
      const appointment = await prisma.appointment.updateMany({
        where: {
          id: appointmentId,
          userId: userId
        },
        data: updateData
      });

      if (appointment.count === 0) {
        return null; // Consulta não encontrada ou não pertence ao usuário
      }

      // Buscar a consulta atualizada com relações
      const updatedAppointment = await this.getAppointmentById(appointmentId, userId);
      
      console.log('✅ Consulta atualizada no Prisma:', appointmentId);
      return updatedAppointment;
    } catch (error) {
      console.error('❌ Erro ao atualizar consulta no Prisma:', error);
      throw error;
    }
  }

  // Confirmar presença em consulta
  static async confirmAppointment(appointmentId: string, userId: string) {
    try {
      console.log('✅ Confirmando presença no Prisma:', appointmentId);
      
      return await this.updateAppointment(appointmentId, { confirmed: true }, userId);
    } catch (error) {
      console.error('❌ Erro ao confirmar presença no Prisma:', error);
      throw error;
    }
  }

  // Cancelar consulta
  static async deleteAppointment(appointmentId: string, userId: string) {
    try {
      console.log('🗑️ Removendo consulta no Prisma:', appointmentId);
      
      const appointment = await prisma.appointment.deleteMany({
        where: {
          id: appointmentId,
          userId: userId
        }
      });

      if (appointment.count === 0) {
        return null; // Consulta não encontrada ou não pertence ao usuário
      }

      console.log('✅ Consulta removida no Prisma:', appointmentId);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover consulta no Prisma:', error);
      throw error;
    }
  }

  // Obter consultas por período
  static async getAppointmentsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ) {
    try {
      console.log('📅 Buscando consultas por período no Prisma:', { userId, startDate, endDate });
      
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: userId,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          doctor: true,
          location: true
        },
        orderBy: [
          { date: 'asc' },
          { time: 'asc' }
        ]
      });

      console.log('✅ Consultas encontradas por período:', appointments.length);
      return appointments;
    } catch (error) {
      console.error('❌ Erro ao buscar consultas por período no Prisma:', error);
      throw error;
    }
  }

  // Obter próximas consultas (útil para dashboard)
  static async getUpcomingAppointments(userId: string, limit: number = 5) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      console.log('🔜 Buscando próximas consultas no Prisma para:', userId);
      
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: userId,
          date: {
            gte: today
          }
        },
        include: {
          doctor: true,
          location: true
        },
        orderBy: [
          { date: 'asc' },
          { time: 'asc' }
        ],
        take: limit
      });

      console.log('✅ Próximas consultas encontradas:', appointments.length);
      return appointments;
    } catch (error) {
      console.error('❌ Erro ao buscar próximas consultas no Prisma:', error);
      throw error;
    }
  }

  // Obter médicos disponíveis
  static async getDoctors() {
    try {
      console.log('👨‍⚕️ Buscando médicos no Prisma');
      
      const doctors = await prisma.doctor.findMany({
        orderBy: {
          name: 'asc'
        }
      });

      console.log('✅ Médicos encontrados:', doctors.length);
      return doctors;
    } catch (error) {
      console.error('❌ Erro ao buscar médicos no Prisma:', error);
      throw error;
    }
  }

  // Obter localizações disponíveis
  static async getLocations() {
    try {
      console.log('🏥 Buscando localizações no Prisma');
      
      const locations = await prisma.location.findMany({
        orderBy: {
          name: 'asc'
        }
      });

      console.log('✅ Localizações encontradas:', locations.length);
      return locations;
    } catch (error) {
      console.error('❌ Erro ao buscar localizações no Prisma:', error);
      throw error;
    }
  }

  // Verificar disponibilidade de horário
  static async checkTimeSlotAvailability(
    doctorId: string,
    locationId: string,
    date: string,
    time: string
  ) {
    try {
      console.log('⏰ [PRISMA] Verificando disponibilidade:', { doctorId, locationId, date, time });
      
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          doctorId: doctorId,
          locationId: locationId,
          date: date,
          time: time
        }
      });

      const isAvailable = !existingAppointment;
      console.log('✅ [PRISMA] Horário disponível:', isAvailable);
      
      if (existingAppointment) {
        console.log('⚠️ [PRISMA] Consulta existente encontrada:', existingAppointment.id);
      }
      
      return isAvailable;
    } catch (error) {
      console.error('❌ [PRISMA] Erro ao verificar disponibilidade:', error);
      console.error('❌ [PRISMA] Stack trace:', error instanceof Error ? error.stack : 'N/A');
      throw error;
    }
  }
} 