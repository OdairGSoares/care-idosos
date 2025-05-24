import { injectable } from 'tsyringe';
import databaseConfig from '../../database/databaseConfig';
import ILocationFromDBRepository, { ILocationData } from '../../interfaces/repositories/locationFromDB.interface';

@injectable()
class LocationFromDBRepository
  implements ILocationFromDBRepository
{
  private db;

  constructor() {
    this.db = databaseConfig.firestore().collection('locations');
  }

  async getLocationsFromDB(
  ): Promise<ILocationData[]> {
      const refDB = await this.db.get();

      const LocationList = refDB.docs.map((doc) => {
        const docData = doc.data() as ILocationData;

        if (docData) {
          return docData;
        } else {
          throw new Error('Document not found!');
        }
      });

      return LocationList;
  }

  async getLocationByIdFromDB(
    locationId: string,
  ): Promise<ILocationData> {
    const refDB = await this.db.doc(locationId).get();

    if (refDB.exists) {
      const data = refDB.data() as ILocationData;

      if (data) {
        return data;
      } else {
        throw new Error('Location not found!');
      }
    } else {
      throw new Error('Document not found!');
    }
  }
}

export default LocationFromDBRepository;