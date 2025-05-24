import { inject, injectable } from 'tsyringe';
import ILocationService from '../../interfaces/services/location.interface';
import ILocationFromDBRepository, { ILocationData } from '../../interfaces/repositories/locationFromDB.interface';

@injectable()
class LocationService implements ILocationService {
  constructor(
    @inject('LocationFromDBRepository')
    private locationFromDBRepository: ILocationFromDBRepository,
  ) {}

  async getLocations(): Promise<ILocationData[]> {
    const locationListFromDB =
      await this.locationFromDBRepository.getLocationsFromDB();

    if (!locationListFromDB) {
      throw new Error('Location list not found!');
    }

    return locationListFromDB || [];
  }

  async getLocationById(locationId: string): Promise<ILocationData> {
    const locationFromDB =
      await this.locationFromDBRepository.getLocationByIdFromDB(
        locationId,
      );

    if (!locationFromDB) {
      throw new Error('Location not found!');
    }

    return locationFromDB;
  }
}

export default LocationService;
