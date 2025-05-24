import { inject, injectable } from 'tsyringe';
import { Body, Delete, Get, Path, Post, Put, Route, Security, Tags, Request as Request } from 'tsoa';
import AppointmentScheduleService from '../../services/appointmentSchedule/appointmentSchedule.service';
import { IAppointmentData, IAppointmentScheduleData, IConfirmScheduleData } from '../../interfaces/repositories/appointmentScheduleFromDB.interface';
import { AuthenticatedRequest } from 'express';

@injectable()
@Route('appointment')
@Tags('Agendamento de Consultas')
class AppointmentScheduleController {
  constructor(
    @inject('AppointmentScheduleService')
    private appointmentScheduleService: AppointmentScheduleService,
  ) {}

  @Get('/')
  @Security('jwt')
  async getSchedule(@Request() req: AuthenticatedRequest): Promise<IAppointmentScheduleData[]> {
    try {
      const userId = req.user.userId;
      const response = await this.appointmentScheduleService.getSchedule(userId!);

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Get('/:id')
  @Security('jwt')
  async getScheduleById(@Request() req: AuthenticatedRequest, @Path() id: string): Promise<IAppointmentScheduleData> {
    try {
      if (!id) {
        throw new Error('Resource is missing!');
      }

      const userId = req.user.userId;
      const response = await this.appointmentScheduleService.getScheduleById(id, userId!);

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Post('/')
  @Security('jwt')
  async addSchedule(@Request() req: AuthenticatedRequest, @Body() body: IAppointmentData
  ): Promise<string> {
    const { doctorId, locationId, date, time, createdAt } = body;

    try {
      if (!doctorId || !locationId || !date || !time || !createdAt) {
        throw new Error('Resource is missing!');
      }

      const userId = req.user.userId;
      const response = await this.appointmentScheduleService.addSchedule(
        body,
        userId!
      );

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Put('/:id')
  @Security('jwt')
  async updateSchedule(
    @Request() req: AuthenticatedRequest,
    @Path() id: string, 
    @Body() body: IAppointmentData
  ): Promise<string> {
    const { doctorId, locationId, date, time, createdAt } = body;

    try {
      if (!id || !body) {
        throw new Error('Resource is missing!');
      }

      const userId = req.user.userId;
      const response = await this.appointmentScheduleService.updateSchedule(
        id,
        body,
        userId!
      );

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Delete('/:id')
  @Security('jwt')
  async removeSchedule(@Request() req: AuthenticatedRequest, @Path() id: string): Promise<string> {
    try {
      if (!id) {
        throw new Error('Resource is missing!');
      }

      const userId = req.user.userId;
      const response = await this.appointmentScheduleService.removeSchedule(id, userId!);

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Put('/confirmed/:id')
  @Security('jwt')
  async confirmSchedule(
    @Request() req: AuthenticatedRequest,
    @Path() id: string,
    @Body() body: IConfirmScheduleData
  ): Promise<IConfirmScheduleData> {
    const { confirmed } = body;

    try {
      if (!id && !confirmed) {
        throw new Error('Resource is missing!');
      }

      const userId = req.user.userId;
      const response = await this.appointmentScheduleService.confirmSchedule(id, confirmed, userId!);

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }
}

export default AppointmentScheduleController;
