// Serviços Prisma centralizados
export { PrismaMedicationService } from './medicationService.prisma';
export { PrismaUserService } from './userService.prisma';
export { PrismaEmergencyContactService } from './emergencyContactService.prisma';
export { PrismaAppointmentService } from './appointmentService.prisma';
export { PrismaDoctorService } from './doctorService.prisma';
export { PrismaLocationService } from './locationService.prisma';

// Re-exportação dos tipos para facilitar uso
export type * from '../../types/api' 