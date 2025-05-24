import { container } from 'tsyringe';

import EmergencyContactsController from '../../controllers/emergencyContacts/emergencyContacts.controller';
import EmergencyContactsService from '../../services/emergencyContacts/emergencyContacts.service';
import EmergencyContactsFromDBRepository from '../../repositories/emergencyContacts/emergencyContactsFromDB.repository';

container.register('EmergencyContactsController', {
  useClass: EmergencyContactsController,
});
container.register('EmergencyContactsService', {
  useClass: EmergencyContactsService,
});
container.register('EmergencyContactsFromDBRepository', {
  useClass: EmergencyContactsFromDBRepository,
});

export { container as emergencyContacts };
