import { inject, injectable } from 'tsyringe';
import EmergencyContactsService from '../../services/emergencyContacts/emergencyContacts.service';
import { Body, Delete, Get, Path, Post, Put, Route, Security, Tags, Request as Request } from 'tsoa';
import { IContactsData, IContactsDataWithoutId } from '../../interfaces/repositories/emergencyContactsFromDB.interface';
import { AuthenticatedRequest } from 'express';

@injectable()
@Route('contacts')
@Tags('Contatos de Emergência')
class EmergencyContactsController {
  constructor(
    @inject('EmergencyContactsService')
    private emergencyContactsService: EmergencyContactsService,
  ) {}

  @Get('/')
  @Security('jwt')
  async getEmergencyContacts(@Request() req: AuthenticatedRequest): Promise<IContactsData[]> {
    try {
      const userId = req.user.userId;
      const response =
        await this.emergencyContactsService.getEmergencyContacts(userId!);

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
  async getEmergencyContactById(@Request() req: AuthenticatedRequest, @Path() id: string): Promise<IContactsData> {
    try {
      if (!id) {
        throw new Error('Resource is missing!');
      }

      const userId = req.user.userId;
      const response =
        await this.emergencyContactsService.getEmergencyContactById(id, userId!);

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
  async addEmergencyContact(@Request() req: AuthenticatedRequest, @Body() body: IContactsDataWithoutId): Promise<string> {
    const { name, phone, relationship, isMainContact } = body
    try {
      if (!body) {
        throw new Error('Resource is missing!');
      }

      const userId = req.user.userId;
      const response = await this.emergencyContactsService.addEmergencyContact( 
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
  async updateEmergencyContact(
    @Request() req: AuthenticatedRequest,
    @Path() id: string, 
    @Body() body: IContactsDataWithoutId): Promise<string> {
      const { name, phone, relationship, isMainContact } = body
    try {
      if (!id && !body) {
        throw new Error('Resource is missing!');
      }

      const userId = req.user.userId;
      const response =
        await this.emergencyContactsService.updateEmergencyContact(
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
  async removeEmergencyContact(@Request() req: AuthenticatedRequest, @Path() id: string): Promise<string> {
    try {
      if (!id) {
        throw new Error('Resource is missing!');
      }

      const userId = req.user.userId;
      const response =
        await this.emergencyContactsService.removeEmergencyContact(
          id,
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
}

export default EmergencyContactsController;