import { container } from 'tsyringe';

import MedicationController from '../../controllers/medication/medication.controller';
import MedicationService from '../../services/medication/medication.service';
import MedicationFromDBRepository from '../../repositories/medication/medicationFromDB.repository';

container.register('MedicationController', {
  useClass: MedicationController,
});
container.register('MedicationService', {
  useClass: MedicationService,
});
container.register('MedicationFromDBRepository', {
  useClass: MedicationFromDBRepository,
});

export { container as medications };
