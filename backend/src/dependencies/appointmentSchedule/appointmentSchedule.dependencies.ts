import { container } from 'tsyringe';

import AppointmentScheduleFromDBRepository from '../../repositories/appointmentSchedule/appointmentScheduleFromDB.repository';
import AppointmentScheduleService from '../../services/appointmentSchedule/appointmentSchedule.service';
import AppointmentScheduleController from '../../controllers/appointmentSchedule/appointmentSchedule.controller';

container.register('AppointmentScheduleController', {
  useClass: AppointmentScheduleController,
});
container.register('AppointmentScheduleFromDBRepository', {
  useClass: AppointmentScheduleFromDBRepository,
});
container.register('AppointmentScheduleService', {
  useClass: AppointmentScheduleService,
});

export { container as appointmentSchedule };
