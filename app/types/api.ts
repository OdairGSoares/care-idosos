// Tipos de dados do usuário
export interface IUserData {
  userId: string;
  userFirstName: string;
  userLastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface IUserDataWithoutUserId {
  userFirstName: string;
  userLastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface IUserDataWithoutPassword {
  userId: string;
  userFirstName: string;
  userLastName: string;
  phone: string;
  email: string;
}

export interface IUserDataLogin {
  email: string;
  password: string;
}

export interface IUserToken {
  userId: string;
  token: string;
  email: string;
}

// Tipos de dados de medicamentos (atualizados para Prisma)
export interface IMedicationsData {
  id: string;
  name: string;
  dosage: number;
  time: string;
  reminder?: boolean; // Campo adicional para Prisma
  taken?: boolean;    // Campo adicional para Prisma
}

export interface IMedicationsDataWithoutId {
  name: string;
  dosage: number;
  time: string;
  reminder?: boolean;
  taken?: boolean;
}

export interface IMedicationReminderUpdate {
  reminder: boolean;
}

export interface IMedicationTakenUpdate {
  taken: boolean;
}

// Tipos de dados de localização
export interface ILocationData {
  locationId: string;
  locationName: string;
  locationAddress: string;
  locationCity: string;
}

// Tipos de dados de contatos de emergência
export interface IContactsData {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isMainContact: boolean;
}

export interface IContactsDataWithoutId {
  name: string;
  phone: string;
  relationship: string;
  isMainContact: boolean;
}

// Tipos de dados de médicos
export interface IDoctorsData {
  doctorId: string;
  doctorName: string;
  specialty: string;
  image?: string;
}

// Tipos de dados de agendamentos (atualizados para Prisma)
export interface IAppointmentScheduleData {
  userId: string;
  id: string;
  doctorId: string;
  locationId: string;
  date: string;
  time: string;
  createdAt: string;
  confirmed?: boolean; // Campo adicional para Prisma
  doctor?: IDoctorsData; // Relacionamento expandido
  location?: ILocationData; // Relacionamento expandido
}

export interface IAppointmentData {
  doctorId: string;
  locationId: string;
  date: string;
  time: string;
  createdAt: string;
  confirmed?: boolean;
}

export interface IConfirmScheduleData {
  confirmed: boolean;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Tipos de erro
export interface ApiError {
  message: string;
  status?: number;
}

// Tipos específicos do Prisma (para uso interno)
export interface PrismaUser {
  id: string;
  userFirstName: string;
  userLastName: string;
  phone: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaMedication {
  id: string;
  name: string;
  dosage: number;
  time: string;
  reminder: boolean;
  taken: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaAppointment {
  id: string;
  date: string;
  time: string;
  confirmed: boolean;
  userId: string;
  doctorId: string;
  locationId: string;
  createdAt: Date;
  updatedAt: Date;
} 