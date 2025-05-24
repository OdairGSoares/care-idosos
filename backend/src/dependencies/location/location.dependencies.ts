import { container } from 'tsyringe';

import LocationController from '../../controllers/location/location.controller';
import LocationService from '../../services/location/location.service';
import LocationFromDBRepository from '../../repositories/location/location.repository';

container.register('LocationController', {
  useClass: LocationController,
});
container.register('LocationService', {
  useClass: LocationService,
});
container.register('LocationFromDBRepository', {
  useClass: LocationFromDBRepository,
});

export { container as location };
