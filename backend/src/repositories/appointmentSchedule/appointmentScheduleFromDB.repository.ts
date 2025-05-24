import { injectable } from 'tsyringe';
import databaseConfig from '../../database/databaseConfig';
import IAppointmentScheduleFromDBRepository, { IAppointmentData, IAppointmentScheduleData, IConfirmScheduleData } from '../../interfaces/repositories/appointmentScheduleFromDB.interface';

@injectable()
class AppointmentScheduleFromDBRepository
  implements IAppointmentScheduleFromDBRepository
{
  private servicesDB;

  constructor() {
    this.servicesDB = databaseConfig.firestore().collection('schedules');
  }

  async getScheduleFromDB(userId: string): Promise<IAppointmentScheduleData[]> {
      const refDB = await this.servicesDB.where('userId', '==', userId).get();

      const scheduleList = refDB.docs.map((doc) => {
        const docData = doc.data() as IAppointmentScheduleData;

        if (docData) {
          return docData;
        } else {
          throw new Error('Document not found!');
        }
      });

      return scheduleList;
  }

  async getScheduleByIdFromDB(
    id: string,
    userId: string
  ): Promise<IAppointmentScheduleData> {
    const refDB = this.servicesDB.doc(id);
    const docSnap = await refDB.get();

    if (!docSnap.exists) {
    throw new Error('Schedule not found!');
  }

    if (docSnap.exists) {
      const data = docSnap.data() as IAppointmentScheduleData;

      if (data) {
        const data = docSnap.data() as IAppointmentScheduleData;

        if (data.userId !== userId) {
          throw new Error('Unauthorized to access this schedule!');
        }

        return data;
      } else {
        throw new Error('Schedule not found!');
      }
    } else {
      throw new Error('Document not found!');
    }
  }

  async addScheduleFromDB(
    data: IAppointmentData,
    userId: string
  ): Promise<string> {
    const refDB = this.servicesDB;
    const docRef = await refDB.add({
      doctorId: data.doctorId, 
      locationId: data.locationId,
      date: data.date,
      time: data.time, 
      createdAt: data.createdAt,
      userId: userId
    });

    docRef.update({ id: docRef.id });

    return 'Schedule added successfully!';
  }

  async updateScheduleFromDB(
    id: string,
    data: IAppointmentData,
    userId: string,
  ): Promise<string> {
    const refDB = this.servicesDB.doc(id);
    const docRef = await this.servicesDB.doc(id).get();
    
    if (!docRef.exists) {
      throw new Error('Schedule not found!');
    }

    const dataAppointment = docRef.data() as IAppointmentScheduleData;


    if (dataAppointment.userId !== userId) {
      throw new Error('Unauthorized to update this schedule!');
    }
      refDB.update({
        userId: userId,
        doctorId: data.doctorId, 
        locationId: data.locationId,
        date: data.date,
        time: data.time, 
        createdAt: data.createdAt
      });

      return 'Schedule updated successfully!';
  }

  async removeScheduleFromDB(id: string, userId: string): Promise<string> {
    const refDB = this.servicesDB.doc(id);
    const doc = await refDB.get();

    if (doc.exists && doc.data()?.userId === userId) {
      await refDB.delete();

      return 'Schedule removed successfully!';
    } else {
      throw new Error('Document not found!');
    }
  }

  async confirmScheduleFromDB(id: string, confirmed: boolean, userId: string): Promise<IConfirmScheduleData> {
    const refDB = await this.servicesDB.doc(id).get();

    const data = refDB.data() as IAppointmentScheduleData;

    if (refDB.exists) {
        refDB.ref.update({
          confirmed: confirmed,
        });

      return {
        ...data,
        confirmed: confirmed
      }
    } else {
      throw new Error('Document not found!');
    }
  }
}

export default AppointmentScheduleFromDBRepository;
