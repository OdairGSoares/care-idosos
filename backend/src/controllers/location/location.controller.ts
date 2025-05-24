import { inject, injectable } from 'tsyringe';
import { Get, Path, Route, Security, Tags } from 'tsoa';
import LocationService from '../../services/location/location.service';
import { ILocationData } from '../../interfaces/repositories/locationFromDB.interface';

@injectable()
@Route('location')
@Tags('Endereços das Clínicas')
class LocationController {
  constructor(
    @inject('LocationService')
    private locationService: LocationService,
  ) {}

  @Get('/')
  @Security('jwt')
  async getLocations(): Promise<ILocationData[]> {
    try {
      const response = await this.locationService.getLocations();

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Get('/:locationId')
  @Security('jwt')
  async getLocationById(@Path() locationId: string): Promise<ILocationData> {
    try {
      if (!locationId) {
        throw new Error('Resource is missing!');
      }

      const response = await this.locationService.getLocationById(locationId);

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }
}

export default LocationController;
