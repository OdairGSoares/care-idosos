import { get } from '@/utils/apiService';
import type { IDoctorsData } from '@/types/api';

/**
 * Serviços para gerenciamento de médicos
 */
export class DoctorService {
  
  /**
   * Lista todos os médicos disponíveis
   */
  static async getDoctors(): Promise<IDoctorsData[] | null> {
    return get<IDoctorsData[]>('/doctor');
  }

  /**
   * Busca um médico específico por ID
   */
  static async getDoctorById(doctorId: string): Promise<IDoctorsData | null> {
    return get<IDoctorsData>(`/doctor/${doctorId}`);
  }

  /**
   * Busca médicos por especialidade
   */
  static async getDoctorsBySpecialty(specialty: string): Promise<IDoctorsData[] | null> {
    const doctors = await this.getDoctors();
    if (!doctors) return null;
    
    return doctors.filter(doctor => 
      doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }

  /**
   * Busca médicos por nome
   */
  static async getDoctorsByName(name: string): Promise<IDoctorsData[] | null> {
    const doctors = await this.getDoctors();
    if (!doctors) return null;
    
    return doctors.filter(doctor => 
      doctor.doctorName.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * Obtém lista de todas as especialidades disponíveis
   */
  static async getSpecialties(): Promise<string[] | null> {
    const doctors = await this.getDoctors();
    if (!doctors) return null;
    
    const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
    return specialties.sort();
  }
} 