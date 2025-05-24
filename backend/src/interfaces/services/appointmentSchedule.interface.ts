import { IAppointmentData, IAppointmentScheduleData, IConfirmScheduleData } from '../repositories/appointmentScheduleFromDB.interface';

interface IAppointmentScheduleService {
  getSchedule(userId: string): Promise<IAppointmentScheduleData[]>;
  getScheduleById(id: string, userId: string): Promise<IAppointmentScheduleData>;
  addSchedule(
    data: IAppointmentData,
    userId: string
  ): Promise<string>;
  updateSchedule(
    id: string,
    data: IAppointmentData,
    userId: string
  ): Promise<string>;
  removeSchedule(id: string, userId: string): Promise<string>;
  confirmSchedule(id: string, confirmed: boolean, userId: string): Promise<IConfirmScheduleData>;
}

export default IAppointmentScheduleService;
