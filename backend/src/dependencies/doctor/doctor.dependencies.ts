import { container } from 'tsyringe';

import DoctorController from '../../controllers/doctor/doctor.controller';
import DoctorService from '../../services/doctor/doctor.service';
import DoctorFromDBRepository from '../../repositories/doctor/doctorFromDB.repository';

container.register('DoctorController', {
  useClass: DoctorController,
});
container.register('DoctorService', {
  useClass: DoctorService,
});
container.register('DoctorFromDBRepository', {
  useClass: DoctorFromDBRepository,
});

export { container as doctor };
