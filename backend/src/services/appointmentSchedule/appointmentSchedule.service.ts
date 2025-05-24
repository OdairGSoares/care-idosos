import IAppointmentScheduleService from '../../interfaces/services/appointmentSchedule.interface';
import IAppointmentScheduleFromDBRepository, { IAppointmentData, IAppointmentScheduleData, IConfirmScheduleData, IFullAppointmentScheduleData } from '../../interfaces/repositories/appointmentScheduleFromDB.interface';
import { inject, injectable } from 'tsyringe';
import IDoctorFromDBRepository from '../../interfaces/repositories/doctorsFromDB.interface';
import ILocationFromDBRepository from '../../interfaces/repositories/locationFromDB.interface';

@injectable()
class AppointmentScheduleService implements IAppointmentScheduleService {
  constructor(
    @inject('AppointmentScheduleFromDBRepository')
    private appointmentScheduleFromDBRepository: IAppointmentScheduleFromDBRepository,
    @inject('DoctorFromDBRepository')
    private doctorFromDBRepository: IDoctorFromDBRepository,
    @inject('LocationFromDBRepository')
    private locationFromDBRepository: ILocationFromDBRepository,
  ) {}

  async getSchedule(userId: string): Promise<IFullAppointmentScheduleData[]> {
    const doctorData = await this.doctorFromDBRepository.getDoctorsFromDB();
    const locationData = await this.locationFromDBRepository.getLocationsFromDB();
    const appointmentData =
      await this.appointmentScheduleFromDBRepository.getScheduleFromDB(userId);

      
    if (!appointmentData && !doctorData && !locationData) {
      throw new Error('Data not found!');
    }
    
    const appointmentList = appointmentData.map((data) => {
      const doctor = doctorData.find((doc) => doc.doctorId === data.doctorId);
      const location = locationData.find((loc) => loc.locationId === data.locationId);

      if (!doctor || !location) {
        throw new Error('Doctor or location not found!');
      }
      
      return {
        ...data,
        doctorName: doctor.doctorName,
        specialty: doctor.specialty,  
        locationName: location.locationName,
        locationAddress: location.locationAddress,
        locationCity: location.locationCity,
      }
    })

    return appointmentList || [];
  }

  async getScheduleById(id: string, userId: string): Promise<IFullAppointmentScheduleData> {
    const appointment =
    await this.appointmentScheduleFromDBRepository.getScheduleByIdFromDB(
      id,
      userId
    );
    
    const doctorData = await this.doctorFromDBRepository.getDoctorByIdFromDB(appointment.doctorId);

    const locationData = await this.locationFromDBRepository.getLocationByIdFromDB(appointment.locationId);
    
    if (!appointment && !doctorData && !locationData) {
      throw new Error('Data not found!');
    }

    return {
      ...appointment,
      doctorName: doctorData.doctorName,
      specialty: doctorData.specialty,
      locationName: locationData.locationName,
      locationAddress: locationData.locationAddress,
      locationCity: locationData.locationCity,
    }
  }

  async addSchedule(
    data: IAppointmentData,
    userId: string
  ): Promise<string> {
    const addScheduleOnDB =
      await this.appointmentScheduleFromDBRepository.addScheduleFromDB(
        data,
        userId
      );

    if (!addScheduleOnDB) {
      throw new Error('Data not found!');
    }

    return 'Appointment added successfully!';
  }

  async updateSchedule(
    id: string,
    data: IAppointmentData,
    userId: string
  ): Promise<string> {
    const updateScheduleOnDB =
      await this.appointmentScheduleFromDBRepository.updateScheduleFromDB(
        id,
        data,
        userId
      );

    if (!updateScheduleOnDB) {
      throw new Error('Data not found!');
    }

    return 'Appointment schedule updated successfully!';
  }

  async removeSchedule(id: string, userId: string): Promise<string> {
    const removeScheduleFromDB =
      await this.appointmentScheduleFromDBRepository.removeScheduleFromDB(
        id,
        userId
      );

    if (!removeScheduleFromDB) {
      throw new Error('Data not found!');
    }

    return 'Appointment schedule removed successfully!';
  }

  async confirmSchedule(id: string, confirmed: boolean, userId: string): Promise<IConfirmScheduleData> {
    const confirmAppointmentFromDB =
      await this.appointmentScheduleFromDBRepository.confirmScheduleFromDB(
        id,
        confirmed,
        userId
      );

    if (!confirmAppointmentFromDB) {
      throw new Error('Data not found!');
    }

    return confirmAppointmentFromDB;
  }
}

export default AppointmentScheduleService;
