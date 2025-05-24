import { injectable } from 'tsyringe';
import databaseConfig from '../../database/databaseConfig';
import IDoctorFromDBRepository, { IDoctorsData } from '../../interfaces/repositories/doctorsFromDB.interface';

@injectable()
class DoctorFromDBRepository
  implements IDoctorFromDBRepository
{
  private servicesDB;

  constructor() {
    this.servicesDB = databaseConfig.firestore().collection('doctors');
  }

  async getDoctorsFromDB(
  ): Promise<IDoctorsData[]> {
      const refDB = await this.servicesDB.get();

      const doctorsList = refDB.docs.map((doc) => {
        const docData = doc.data() as IDoctorsData;

        if (docData) {
          return docData;
        } else {
          throw new Error('Document not found!');
        }
      });

      return doctorsList;
  }

  async getDoctorByIdFromDB(
    doctorId: string,
  ): Promise<IDoctorsData> {
    const refDB = await this.servicesDB.doc(doctorId).get();

    if (refDB.exists) {
      const data = refDB.data() as IDoctorsData;

      if (data) {
        return data;
      } else {
        throw new Error('Doctor not found!');
      }
    } else {
      throw new Error('Document not found!');
    }
  }
}

export default DoctorFromDBRepository;