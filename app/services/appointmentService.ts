import { get, post, put, del } from '@/utils/apiService';
import type { 
  IAppointmentScheduleData,
  IAppointmentData,
  IConfirmScheduleData
} from '@/types/api';

/**
 * Serviços para gerenciamento de agendamentos de consultas
 */
export class AppointmentService {
  
  /**
   * Lista todos os agendamentos do usuário logado
   */
  static async getSchedule(): Promise<IAppointmentScheduleData[] | null> {
    return get<IAppointmentScheduleData[]>('/appointment');
  }

  /**
   * Busca um agendamento específico por ID
   */
  static async getScheduleById(id: string): Promise<IAppointmentScheduleData | null> {
    return get<IAppointmentScheduleData>(`/appointment/${id}`);
  }

  /**
   * Cria um novo agendamento
   */
  static async addSchedule(appointment: IAppointmentData): Promise<string | null> {
    return post<IAppointmentData, string>(
      '/appointment',
      appointment,
      true,
      true,
      'Consulta agendada com sucesso!'
    );
  }

  /**
   * Atualiza um agendamento existente
   */
  static async updateSchedule(
    id: string, 
    appointment: IAppointmentData
  ): Promise<string | null> {
    return put<IAppointmentData, string>(
      `/appointment/${id}`,
      appointment,
      true,
      true,
      'Agendamento atualizado com sucesso!'
    );
  }

  /**
   * Remove um agendamento
   */
  static async removeSchedule(id: string): Promise<string | null> {
    return del<string>(
      `/appointment/${id}`,
      true,
      true,
      'Agendamento cancelado com sucesso!'
    );
  }

  /**
   * Confirma ou desconfirma um agendamento
   */
  static async confirmSchedule(
    id: string, 
    confirmData: IConfirmScheduleData
  ): Promise<IConfirmScheduleData | null> {
    return put<IConfirmScheduleData, IConfirmScheduleData>(
      `/appointment/confirmed/${id}`,
      confirmData,
      true,
      true,
      confirmData.confirmed ? 'Consulta confirmada!' : 'Confirmação cancelada!'
    );
  }

  /**
   * Busca agendamentos por data
   */
  static async getScheduleByDate(date: string): Promise<IAppointmentScheduleData[] | null> {
    const appointments = await this.getSchedule();
    if (!appointments) return null;
    
    return appointments.filter(appointment => appointment.date === date);
  }

  /**
   * Busca agendamentos por médico
   */
  static async getScheduleByDoctor(doctorId: string): Promise<IAppointmentScheduleData[] | null> {
    const appointments = await this.getSchedule();
    if (!appointments) return null;
    
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  }

  /**
   * Busca agendamentos por localização
   */
  static async getScheduleByLocation(locationId: string): Promise<IAppointmentScheduleData[] | null> {
    const appointments = await this.getSchedule();
    if (!appointments) return null;
    
    return appointments.filter(appointment => appointment.locationId === locationId);
  }

  /**
   * Busca próximos agendamentos (ordenados por data/hora)
   */
  static async getUpcomingAppointments(): Promise<IAppointmentScheduleData[] | null> {
    const appointments = await this.getSchedule();
    if (!appointments) return null;
    
    const now = new Date();
    
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        return appointmentDate > now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
  }

  /**
   * Busca agendamentos passados
   */
  static async getPastAppointments(): Promise<IAppointmentScheduleData[] | null> {
    const appointments = await this.getSchedule();
    if (!appointments) return null;
    
    const now = new Date();
    
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        return appointmentDate < now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime(); // mais recentes primeiro
      });
  }
} 