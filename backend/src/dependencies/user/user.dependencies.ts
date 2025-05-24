import { container } from 'tsyringe';

import UserController from '../../controllers/user/user.controller';
import UserFromDBRepository from '../../repositories/user/user.repository';
import UserService from '../../services/user/user.service';

container.register('UserController', {
  useClass: UserController,
});
container.register('UserFromDBRepository', {
  useClass: UserFromDBRepository,
});
container.register('UserService', {
  useClass: UserService,
});

export { container as user };
