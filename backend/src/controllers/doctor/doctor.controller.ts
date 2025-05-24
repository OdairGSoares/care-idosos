import { inject, injectable } from 'tsyringe';
import { Get, Path, Route, Security, Tags } from 'tsoa';
import DoctorService from '../../services/doctor/doctor.service';
import { IDoctorsData } from '../../interfaces/repositories/doctorsFromDB.interface';

@injectable()
@Route('doctor')
@Tags('Médicos')
class DoctorController {
  constructor(
    @inject('DoctorService')
    private doctorService: DoctorService,
  ) {}

  @Get('/')
  @Security('jwt')
  async getDoctors(): Promise<IDoctorsData[]> {
    try {
      const response = await this.doctorService.getDoctors();

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Get('/:doctorId')
  @Security('jwt')
  async getDoctorById(@Path() doctorId: string): Promise<IDoctorsData> {
    try {
      if (!doctorId) {
        throw new Error('Resource is missing!');
      }

      const response = await this.doctorService.getDoctorById(doctorId);

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }
}

export default DoctorController;
