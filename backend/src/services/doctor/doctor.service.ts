import { inject, injectable } from 'tsyringe';
import IDoctorService from '../../interfaces/services/doctors.interface';
import IDoctorFromDBRepository, { IDoctorsData } from '../../interfaces/repositories/doctorsFromDB.interface';

@injectable()
class DoctorService implements IDoctorService {
  constructor(
    @inject('DoctorFromDBRepository')
    private doctorFromDBRepository: IDoctorFromDBRepository,
  ) {}

  async getDoctors(): Promise<IDoctorsData[]> {
    const doctorListFromDB =
      await this.doctorFromDBRepository.getDoctorsFromDB();

    if (!doctorListFromDB) {
      throw new Error('Doctor list not found!');
    }

    return doctorListFromDB || [];
  }

  async getDoctorById(doctorId: string): Promise<IDoctorsData> {
    const doctorFromDB =
      await this.doctorFromDBRepository.getDoctorByIdFromDB(
        doctorId,
      );

    if (!doctorFromDB) {
      throw new Error('Doctor not found!');
    }

    return doctorFromDB;
  }
}

export default DoctorService;
