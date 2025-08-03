import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  UserService,
  MedicationService,
  LocationService,
  EmergencyContactService,
  DoctorService,
  AppointmentService
} from '@/services';
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
export const QUERY_KEYS = {
  USERS: ['users'],
  USER: (id: string) => ['user', id],
  MEDICATIONS: ['medications'],
  MEDICATION: (id: string) => ['medication', id],
  LOCATIONS: ['locations'],
  LOCATION: (id: string) => ['location', id],
  EMERGENCY_CONTACTS: ['emergency-contacts'],
  EMERGENCY_CONTACT: (id: string) => ['emergency-contact', id],
  DOCTORS: ['doctors'],
  DOCTOR: (id: string) => ['doctor', id],
  APPOINTMENTS: ['appointments'],
  APPOINTMENT: (id: string) => ['appointment', id],
  UPCOMING_APPOINTMENTS: ['upcoming-appointments'],
  PAST_APPOINTMENTS: ['past-appointments']
} as const;

// =============================================================================
// USER HOOKS
// =============================================================================

export const useUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: UserService.getUsers,
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER(userId),
    queryFn: () => UserService.getUserById(userId),
    enabled: !!userId,
  });
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: IUserDataWithoutUserId) => UserService.signUp(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: IUserDataLogin) => UserService.login(credentials),
    onSuccess: (data) => {
      if (data) {
        UserService.saveAuthToken(data.token, data.userId);
      }
    },
  });
};

// =============================================================================
// MEDICATION HOOKS
// =============================================================================

export const useMedications = () => {
  return useQuery({
    queryKey: QUERY_KEYS.MEDICATIONS,
    queryFn: MedicationService.getMedications,
  });
};

export const useMedication = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEDICATION(id),
    queryFn: () => MedicationService.getMedicationById(id),
    enabled: !!id,
  });
};

export const useAddMedication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (medication: IMedicationsDataWithoutId) => 
      MedicationService.addMedication(medication),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDICATIONS });
    },
  });
};

export const useRemoveMedication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => MedicationService.removeMedication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDICATIONS });
    },
  });
};

export const useUpdateMedicationReminder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reminderData }: { id: string; reminderData: IMedicationReminderUpdate }) =>
      MedicationService.updateMedicationReminder(id, reminderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDICATIONS });
    },
  });
};

export const useUpdateMedicationTaken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, takenData }: { id: string; takenData: IMedicationTakenUpdate }) =>
      MedicationService.updateMedicationTaken(id, takenData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDICATIONS });
    },
  });
};

export const useResetMedications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => MedicationService.resetMedications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDICATIONS });
    },
  });
};

// =============================================================================
// LOCATION HOOKS
// =============================================================================

export const useLocations = () => {
  return useQuery({
    queryKey: QUERY_KEYS.LOCATIONS,
    queryFn: LocationService.getLocations,
  });
};

export const useLocation = (locationId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.LOCATION(locationId),
    queryFn: () => LocationService.getLocationById(locationId),
    enabled: !!locationId,
  });
};

// =============================================================================
// EMERGENCY CONTACT HOOKS
// =============================================================================

export const useEmergencyContacts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.EMERGENCY_CONTACTS,
    queryFn: EmergencyContactService.getEmergencyContacts,
  });
};

export const useEmergencyContact = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.EMERGENCY_CONTACT(id),
    queryFn: () => EmergencyContactService.getEmergencyContactById(id),
    enabled: !!id,
  });
};

export const useAddEmergencyContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contact: IContactsDataWithoutId) => 
      EmergencyContactService.addEmergencyContact(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMERGENCY_CONTACTS });
    },
  });
};

export const useUpdateEmergencyContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, contact }: { id: string; contact: IContactsDataWithoutId }) =>
      EmergencyContactService.updateEmergencyContact(id, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMERGENCY_CONTACTS });
    },
  });
};

export const useRemoveEmergencyContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => EmergencyContactService.removeEmergencyContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMERGENCY_CONTACTS });
    },
  });
};

// =============================================================================
// DOCTOR HOOKS
// =============================================================================

export const useDoctors = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOCTORS,
    queryFn: DoctorService.getDoctors,
  });
};

export const useDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.DOCTOR(doctorId),
    queryFn: () => DoctorService.getDoctorById(doctorId),
    enabled: !!doctorId,
  });
};

export const useSpecialties = () => {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: DoctorService.getSpecialties,
  });
};

// =============================================================================
// APPOINTMENT HOOKS
// =============================================================================

export const useAppointments = () => {
  return useQuery({
    queryKey: QUERY_KEYS.APPOINTMENTS,
    queryFn: AppointmentService.getSchedule,
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.APPOINTMENT(id),
    queryFn: () => AppointmentService.getScheduleById(id),
    enabled: !!id,
  });
};

export const useUpcomingAppointments = () => {
  return useQuery({
    queryKey: QUERY_KEYS.UPCOMING_APPOINTMENTS,
    queryFn: AppointmentService.getUpcomingAppointments,
  });
};

export const usePastAppointments = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PAST_APPOINTMENTS,
    queryFn: AppointmentService.getPastAppointments,
  });
};

export const useAddAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appointment: IAppointmentData) => 
      AppointmentService.addSchedule(appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UPCOMING_APPOINTMENTS });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, appointment }: { id: string; appointment: IAppointmentData }) =>
      AppointmentService.updateSchedule(id, appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UPCOMING_APPOINTMENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAST_APPOINTMENTS });
    },
  });
};

export const useRemoveAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => AppointmentService.removeSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UPCOMING_APPOINTMENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAST_APPOINTMENTS });
    },
  });
};

export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, confirmData }: { id: string; confirmData: IConfirmScheduleData }) =>
      AppointmentService.confirmSchedule(id, confirmData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UPCOMING_APPOINTMENTS });
    },
  });
}; 