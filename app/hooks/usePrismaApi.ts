import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  PrismaUserService,
  PrismaMedicationService,
  PrismaLocationService,
  PrismaEmergencyContactService,
  PrismaDoctorService,
  PrismaAppointmentService
} from '@/services/prisma';
import type {
  IUserDataWithoutUserId,
  IUserDataLogin,
  IMedicationsDataWithoutId,
  IMedicationReminderUpdate,
  IMedicationTakenUpdate,
  IContactsDataWithoutId,
  IAppointmentData,
  IConfirmScheduleData
} from '@/types/api';

// Query Keys para organização
export const PRISMA_QUERY_KEYS = {
  USERS: ['prisma-users'],
  USER: (id: string) => ['prisma-user', id],
  MEDICATIONS: (userId: string) => ['prisma-medications', userId],
  MEDICATION: (id: string, userId: string) => ['prisma-medication', id, userId],
  LOCATIONS: ['prisma-locations'],
  LOCATION: (id: string) => ['prisma-location', id],
  EMERGENCY_CONTACTS: (userId: string) => ['prisma-emergency-contacts', userId],
  EMERGENCY_CONTACT: (id: string, userId: string) => ['prisma-emergency-contact', id, userId],
  DOCTORS: ['prisma-doctors'],
  DOCTOR: (id: string) => ['prisma-doctor', id],
  APPOINTMENTS: (userId: string) => ['prisma-appointments', userId],
  APPOINTMENT: (id: string, userId: string) => ['prisma-appointment', id, userId],
  UPCOMING_APPOINTMENTS: (userId: string) => ['prisma-upcoming-appointments', userId],
  PAST_APPOINTMENTS: (userId: string) => ['prisma-past-appointments', userId],
  SPECIALTIES: ['prisma-specialties'],
  CITIES: ['prisma-cities']
} as const;

// Helper para obter userId atual
const getCurrentUserId = (): string => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }
  return userId;
};

// =============================================================================
// USER HOOKS
// =============================================================================

export const usePrismaUsers = () => {
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.USERS,
    queryFn: PrismaUserService.getUsers,
  });
};

export const usePrismaUser = (userId: string) => {
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.USER(userId),
    queryFn: () => PrismaUserService.getUserById(userId),
    enabled: !!userId,
  });
};

export const usePrismaSignUp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: IUserDataWithoutUserId) => PrismaUserService.signUp(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.USERS });
      toast.success('Usuário cadastrado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao cadastrar usuário');
    }
  });
};

export const usePrismaLogin = () => {
  return useMutation({
    mutationFn: (credentials: IUserDataLogin) => PrismaUserService.login(credentials),
    onSuccess: (data) => {
      if (data) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        toast.success('Login realizado com sucesso!');
      }
    },
    onError: () => {
      toast.error('Erro ao fazer login');
    }
  });
};

// =============================================================================
// MEDICATION HOOKS
// =============================================================================

export const usePrismaMedications = () => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.MEDICATIONS(userId),
    queryFn: () => PrismaMedicationService.getMedications(userId),
    enabled: !!userId,
  });
};

export const usePrismaMedication = (id: string) => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.MEDICATION(id, userId),
    queryFn: () => PrismaMedicationService.getMedicationById(id, userId),
    enabled: !!id && !!userId,
  });
};

export const usePrismaAddMedication = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: (medication: IMedicationsDataWithoutId) => 
      PrismaMedicationService.addMedication(medication, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.MEDICATIONS(userId) });
      toast.success('Medicamento adicionado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao adicionar medicamento');
    }
  });
};

export const usePrismaRemoveMedication = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: (id: string) => PrismaMedicationService.removeMedication(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.MEDICATIONS(userId) });
      toast.success('Medicamento removido com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover medicamento');
    }
  });
};

export const usePrismaUpdateMedicationReminder = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: ({ id, reminderData }: { id: string; reminderData: IMedicationReminderUpdate }) =>
      PrismaMedicationService.updateMedicationReminder(id, reminderData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.MEDICATIONS(userId) });
      toast.success('Lembrete atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar lembrete');
    }
  });
};

export const usePrismaUpdateMedicationTaken = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: ({ id, takenData }: { id: string; takenData: IMedicationTakenUpdate }) =>
      PrismaMedicationService.updateMedicationTaken(id, takenData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.MEDICATIONS(userId) });
    },
    onError: () => {
      toast.error('Erro ao atualizar medicamento');
    }
  });
};

export const usePrismaResetMedications = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: () => PrismaMedicationService.resetMedications(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.MEDICATIONS(userId) });
      toast.success('Medicamentos resetados!');
    },
    onError: () => {
      toast.error('Erro ao resetar medicamentos');
    }
  });
};

// =============================================================================
// LOCATION HOOKS
// =============================================================================

export const usePrismaLocations = () => {
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.LOCATIONS,
    queryFn: PrismaLocationService.getLocations,
  });
};

export const usePrismaLocation = (locationId: string) => {
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.LOCATION(locationId),
    queryFn: () => PrismaLocationService.getLocationById(locationId),
    enabled: !!locationId,
  });
};

export const usePrismaCities = () => {
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.CITIES,
    queryFn: PrismaLocationService.getCities,
  });
};

// =============================================================================
// EMERGENCY CONTACT HOOKS
// =============================================================================

export const usePrismaEmergencyContacts = () => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.EMERGENCY_CONTACTS(userId),
    queryFn: () => PrismaEmergencyContactService.getEmergencyContacts(userId),
    enabled: !!userId,
  });
};

export const usePrismaEmergencyContact = (id: string) => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.EMERGENCY_CONTACT(id, userId),
    queryFn: () => PrismaEmergencyContactService.getEmergencyContactById(id, userId),
    enabled: !!id && !!userId,
  });
};

export const usePrismaAddEmergencyContact = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: (contact: IContactsDataWithoutId) => 
      PrismaEmergencyContactService.addEmergencyContact(contact, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.EMERGENCY_CONTACTS(userId) });
      toast.success('Contato adicionado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao adicionar contato');
    }
  });
};

export const usePrismaUpdateEmergencyContact = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: ({ id, contact }: { id: string; contact: IContactsDataWithoutId }) =>
      PrismaEmergencyContactService.updateEmergencyContact(id, contact, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.EMERGENCY_CONTACTS(userId) });
      toast.success('Contato atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar contato');
    }
  });
};

export const usePrismaRemoveEmergencyContact = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: (id: string) => PrismaEmergencyContactService.removeEmergencyContact(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.EMERGENCY_CONTACTS(userId) });
      toast.success('Contato removido com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover contato');
    }
  });
};

// =============================================================================
// DOCTOR HOOKS
// =============================================================================

export const usePrismaDoctors = () => {
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.DOCTORS,
    queryFn: PrismaDoctorService.getDoctors,
  });
};

export const usePrismaDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.DOCTOR(doctorId),
    queryFn: () => PrismaDoctorService.getDoctorById(doctorId),
    enabled: !!doctorId,
  });
};

export const usePrismaSpecialties = () => {
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.SPECIALTIES,
    queryFn: PrismaDoctorService.getSpecialties,
  });
};

// =============================================================================
// APPOINTMENT HOOKS
// =============================================================================

export const usePrismaAppointments = () => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.APPOINTMENTS(userId),
    queryFn: () => PrismaAppointmentService.getSchedule(userId),
    enabled: !!userId,
  });
};

export const usePrismaAppointment = (id: string) => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.APPOINTMENT(id, userId),
    queryFn: () => PrismaAppointmentService.getScheduleById(id, userId),
    enabled: !!id && !!userId,
  });
};

export const usePrismaUpcomingAppointments = () => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.UPCOMING_APPOINTMENTS(userId),
    queryFn: () => PrismaAppointmentService.getUpcomingAppointments(userId),
    enabled: !!userId,
  });
};

export const usePrismaPastAppointments = () => {
  const userId = getCurrentUserId();
  
  return useQuery({
    queryKey: PRISMA_QUERY_KEYS.PAST_APPOINTMENTS(userId),
    queryFn: () => PrismaAppointmentService.getPastAppointments(userId),
    enabled: !!userId,
  });
};

export const usePrismaAddAppointment = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: (appointment: IAppointmentData) => 
      PrismaAppointmentService.addSchedule(appointment, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.APPOINTMENTS(userId) });
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.UPCOMING_APPOINTMENTS(userId) });
      toast.success('Consulta agendada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao agendar consulta');
    }
  });
};

export const usePrismaUpdateAppointment = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: ({ id, appointment }: { id: string; appointment: IAppointmentData }) =>
      PrismaAppointmentService.updateSchedule(id, appointment, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.APPOINTMENTS(userId) });
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.UPCOMING_APPOINTMENTS(userId) });
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.PAST_APPOINTMENTS(userId) });
      toast.success('Agendamento atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar agendamento');
    }
  });
};

export const usePrismaRemoveAppointment = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: (id: string) => PrismaAppointmentService.removeSchedule(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.APPOINTMENTS(userId) });
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.UPCOMING_APPOINTMENTS(userId) });
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.PAST_APPOINTMENTS(userId) });
      toast.success('Agendamento cancelado!');
    },
    onError: () => {
      toast.error('Erro ao cancelar agendamento');
    }
  });
};

export const usePrismaConfirmAppointment = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();
  
  return useMutation({
    mutationFn: ({ id, confirmData }: { id: string; confirmData: IConfirmScheduleData }) =>
      PrismaAppointmentService.confirmSchedule(id, confirmData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.APPOINTMENTS(userId) });
      queryClient.invalidateQueries({ queryKey: PRISMA_QUERY_KEYS.UPCOMING_APPOINTMENTS(userId) });
      toast.success('Consulta confirmada!');
    },
    onError: () => {
      toast.error('Erro ao confirmar consulta');
    }
  });
}; 