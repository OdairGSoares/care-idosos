import { inject, injectable } from 'tsyringe';
import { Body, Delete, Get, Path, Post, Put, Route, Security, Tags, Request as Request } from 'tsoa';
import MedicationService from '../../services/medication/medication.service';
import { IMedicationsData, IMedicationsDataWithoutId } from '../../interfaces/repositories/medicationFromDB.interface';
import { AuthenticatedRequest } from 'express';

@injectable()
@Route('medication')
@Tags('Medicações')
class MedicationController {
  constructor(
    @inject('MedicationService')
    private medicationService: MedicationService,
  ) {}

  @Get('/')
  @Security('jwt')
  async getMedications(@Request() req: AuthenticatedRequest): Promise<IMedicationsData[]> {
    try {
      const userId = req.user.userId;
      const response = await this.medicationService.getMedications(userId!);

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
  async getMedicationById(@Request() req: AuthenticatedRequest, @Path() id: string): Promise<IMedicationsData> {
    try {
      const userId = req.user.userId;

      if (!id) {
        throw new Error('Resource is missing!');
      }

      const response = await this.medicationService.getMedicationById(id, userId!);

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
  async addMedication(@Request() req: AuthenticatedRequest, @Body() body: IMedicationsDataWithoutId
  ): Promise<string> {
    const { name, dosage, time } = body;

    try {
      const userId = req.user.userId;

      if (!name && !dosage && !time) {
        throw new Error('Resource is missing!');
      }

      const response = await this.medicationService.addMedication(
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
  async removeMedication(@Request() req: AuthenticatedRequest, @Path() id: string): Promise<string> {
    try {
      const userId = req.user.userId;

      if (!id) {
        throw new Error('Resource is missing!');
      }

      const response = await this.medicationService.removeMedication(id, userId!);

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Put('/reminder/:id')
  @Security('jwt')
  async updateMedicationReminder(
    @Request() req: AuthenticatedRequest,
    @Path() id: string, 
    @Body() body: { reminder: boolean}
  ): Promise<string> {
    const { reminder } = body;
    
    try {
      if (!id && !reminder) {
        throw new Error('Resource is missing!');
      }
      
      const userId = req.user.userId;
      const response = await this.medicationService.updateMedicationReminder(
        id,
        reminder, 
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

  @Put('/taken/:id')
  @Security('jwt')
  async updateMedicationTaken(
    @Request() req: AuthenticatedRequest,
    @Path() id: string,
    @Body() body: { taken: boolean }
  ): Promise<string> {
    const { taken } = body;
    const userId = req.user.userId;

    try {
      if (!id && !taken) {
        throw new Error('Resource is missing!');
      }

      const response = await this.medicationService.updateMedicationTaken(id, taken, userId!);

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Put('/reset')
  @Security('jwt')
  async resetMedications(@Request() req: AuthenticatedRequest): Promise<string> {
    try {
      const userId = req.user.userId;
      const response = await this.medicationService.resetMedications(userId!);

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }
}

export default MedicationController;
