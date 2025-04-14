
import { toast } from "sonner";

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image?: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
}

export interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: number;
  doctorId: number;
  doctorName: string;
  specialty: string;
  locationId: number;
  locationName: string;
  locationAddress: string;
  date: string;
  time: string;
  confirmed: boolean;
  createdAt: string;
}

// Sample data for doctors
export const doctors: Doctor[] = [
  { id: 1, name: "Dra. Maria Silva", specialty: "Cardiologista" },
  { id: 2, name: "Dr. João Pereira", specialty: "Clínico Geral" },
  { id: 3, name: "Dra. Ana Santos", specialty: "Neurologista" },
  { id: 4, name: "Dr. Carlos Oliveira", specialty: "Ortopedista" },
  { id: 5, name: "Dra. Fernanda Lima", specialty: "Dermatologista" },
  { id: 6, name: "Dr. Ricardo Nunes", specialty: "Oftalmologista" },
];

// Sample data for locations
export const locations: Location[] = [
  { id: 1, name: "Clínica Saúde Total", address: "Av. Paulista, 1000", city: "São Paulo" },
  { id: 2, name: "Hospital São Lucas", address: "Rua Augusta, 500", city: "São Paulo" },
  { id: 3, name: "Centro Médico Vida", address: "Av. Rebouças, 750", city: "São Paulo" },
];

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
export const getSpecialties = (): string[] => {
  const specialties = doctors.map(doctor => doctor.specialty);
  return [...new Set(specialties)];
};

// Get doctors by specialty
export const getDoctorsBySpecialty = (specialty: string): Doctor[] => {
  return doctors.filter(doctor => doctor.specialty === specialty);
};

// Save appointments to localStorage
export const saveAppointment = (appointment: Omit<Appointment, "id" | "createdAt">): Appointment => {
  // Get existing appointments
  const appointments = getAppointments();
  
  // Generate a new ID
  const id = appointments.length > 0
    ? Math.max(...appointments.map(app => app.id)) + 1
    : 1;
  
  // Create the new appointment with ID and createdAt
  const newAppointment: Appointment = {
    ...appointment,
    id,
    createdAt: new Date().toISOString()
  };
  
  // Add to the list and save
  appointments.push(newAppointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  
  return newAppointment;
};

// Get all appointments from localStorage
export const getAppointments = (): Appointment[] => {
  const appointmentsString = localStorage.getItem('appointments');
  return appointmentsString ? JSON.parse(appointmentsString) : [];
};

// Confirm an appointment
export const confirmAppointment = (id: number): boolean => {
  const appointments = getAppointments();
  const index = appointments.findIndex(app => app.id === id);
  
  if (index !== -1) {
    appointments[index].confirmed = true;
    localStorage.setItem('appointments', JSON.stringify(appointments));
    return true;
  }
  
  return false;
};

// Reschedule an appointment
export const rescheduleAppointment = (id: number, newDate: string, newTime: string): boolean => {
  const appointments = getAppointments();
  const index = appointments.findIndex(app => app.id === id);
  
  if (index !== -1) {
    appointments[index].date = newDate;
    appointments[index].time = newTime;
    localStorage.setItem('appointments', JSON.stringify(appointments));
    return true;
  }
  
  return false;
};

// Delete an appointment
export const deleteAppointment = (id: number): boolean => {
  const appointments = getAppointments();
  const filteredAppointments = appointments.filter(app => app.id !== id);
  
  if (filteredAppointments.length !== appointments.length) {
    localStorage.setItem('appointments', JSON.stringify(filteredAppointments));
    return true;
  }
  
  return false;
};
