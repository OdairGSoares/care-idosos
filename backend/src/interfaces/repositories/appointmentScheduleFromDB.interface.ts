export interface IAppointmentScheduleData {
  userId: string;
  id: string;
  doctorId: string, 
  locationId: string, 
  date: string, 
  time: string, 
  createdAt: string
}

export interface IAppointmentData {
  doctorId: string, 
  locationId: string, 
  date: string, 
  time: string, 
  createdAt: string
}

export interface IFullAppointmentScheduleData extends IAppointmentScheduleData{
  doctorName: string,
  specialty: string,
  locationName: string,
  locationAddress: string,
  locationCity: string,
}

export interface IConfirmScheduleData {
  confirmed: boolean;
}

interface IAppointmentScheduleFromDBRepository {
  getScheduleFromDB(userId: string): Promise<IAppointmentScheduleData[]>;
  getScheduleByIdFromDB(id: string, userId: string): Promise<IAppointmentScheduleData>;
  addScheduleFromDB(
    data: IAppointmentData,
    userId: string
  ): Promise<string>;
  updateScheduleFromDB(
    id: string,
    data: IAppointmentData,
    userId: string
  ): Promise<string>;
  removeScheduleFromDB(id: string, userId: string): Promise<string>;
  confirmScheduleFromDB(id: string, confirmed: boolean, userId: string): Promise<IConfirmScheduleData>;
}

export default IAppointmentScheduleFromDBRepository;
