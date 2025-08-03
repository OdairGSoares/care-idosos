
import { get, post, put, del } from './apiService';
import { toast } from "sonner";

export interface Doctor {
  doctorId: string;
  doctorName: string;
  specialty: string;
  image?: string;
}

export interface Location {
  locationId: string;
  locationName: string;
  locationAddress: string;
  locationCity: string;
}

export interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  confirmed: boolean;
  userId: string;
  doctorId: string;
  locationId: string;
  createdAt: string;
  doctor: {
    doctorId: string;
    doctorName: string;
    specialty: string;
  };
  location: {
    locationId: string;
    locationName: string;
    locationAddress: string;
    locationCity: string;
  };
  // Campos flat para compatibilidade retroativa com componentes
  doctorName?: string;
  specialty?: string;
  locationName?: string;
  locationAddress?: string;
  locationCity?: string;
}

// Example locations data
export const locations: Location[] = [
  {
    locationId: "1",
    locationName: "Clínica Central",
    locationAddress: "Av. Paulista, 1000",
    locationCity: "São Paulo"
  },
  {
    locationId: "2",
    locationName: "Hospital São Lucas",
    locationAddress: "Rua Augusta, 500",
    locationCity: "São Paulo"
  },
  {
    locationId: "3",
    locationName: "Centro Médico Jardins",
    locationAddress: "Alameda Santos, 800",
    locationCity: "São Paulo"
  }
];

// Get all doctors from API
export const getDoctors = async (): Promise<Doctor[]> => {
  const doctors = await get<Doctor[]>('/doctor');
  return doctors || [];
};

// Get doctor by ID
export const getDoctor = async (id: string): Promise<Doctor | null> => {
  return await get<Doctor>(`/doctor/${id}`);
};

// Get all locations from API
export const getLocations = async (): Promise<Location[]> => {
  const locations = await get<Location[]>('/location');
  return locations || [];
};

// Get location by ID
export const getLocation = async (id: string): Promise<Location | null> => {
  return await get<Location>(`/location/${id}`);
};

// Get available time slots for a given date
export const getAvailableTimeSlots = (date: Date): TimeSlot[] => {
  // In a real application, this would come from an API
  // For this example, we'll generate random availability
  const timeSlots: TimeSlot[] = [];
  const hours = [8, 9, 10, 11, 13, 14, 15, 16, 17];
  
  hours.forEach((hour, index) => {
    // Generate some random availability
    const isAvailable = Math.random() > 0.3;
    
    timeSlots.push({
      id: index + 1,
      time: `${hour}:00`,
      available: isAvailable
    });
    
    timeSlots.push({
      id: hours.length + index + 1,
      time: `${hour}:30`,
      available: Math.random() > 0.3
    });
  });
  
  return timeSlots;
};

// Get unique specialties from doctors
export const getSpecialties = async (): Promise<string[]> => {
  const doctors = await getDoctors();
  const specialties = doctors.map(doctor => doctor.specialty);
  return Array.from(new Set(specialties));
};

// Get doctors by specialty
export const getDoctorsBySpecialty = async (specialty: string): Promise<Doctor[]> => {
  const doctors = await getDoctors();
  return doctors.filter(doctor => doctor.specialty === specialty);
};

// Save appointment to API
export const saveAppointment = async (appointment: Omit<Appointment, "id" | "createdAt">): Promise<Appointment | null> => {
  return await post<Omit<Appointment, "id" | "createdAt">, Appointment>('/appointment', appointment);
};

// Get all appointments from API
export const getAppointments = async (): Promise<Appointment[]> => {
  const appointments = await get<Appointment[]>('/appointment');
  return appointments || [];
};

// Confirm an appointment
export const confirmAppointment = async (id: string): Promise<boolean> => {
  const result = await put<{}, Appointment>(`/appointment/confirmed/${id}`, {});
  return result !== null;
};

// Reschedule an appointment
export const rescheduleAppointment = async (id: string, newDate: string, newTime: string): Promise<boolean> => {
  const result = await put<{date: string, time: string}, Appointment>(
    `/appointment/${id}`, 
    { date: newDate, time: newTime }
  );
  return result !== null;
};

// Cancel an appointment
export const cancelAppointment = async (id: string): Promise<boolean> => {
  return await deleteAppointment(id);
};

// Delete an appointment
export const deleteAppointment = async (id: string): Promise<boolean> => {
  const result = await del(`/appointment/${id}`);
  return result !== null;
};
