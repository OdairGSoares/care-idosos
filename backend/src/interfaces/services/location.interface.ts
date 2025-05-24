import { ILocationData } from "../repositories/locationFromDB.interface";

interface ILocationService {
  getLocations(): Promise<ILocationData[]>;
  getLocationById(locationId: string): Promise<ILocationData>;
}

export default ILocationService;