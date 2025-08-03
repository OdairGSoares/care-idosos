// Exportação de todos os serviços
export { UserService } from './userService';
export { MedicationService } from './medicationService';
export { LocationService } from './locationService';
export { EmergencyContactService } from './emergencyContactService';
export { DoctorService } from './doctorService';
export { AppointmentService } from './appointmentService';

// Re-exportação dos tipos para facilitar uso
export type * from '@/types/api'; 