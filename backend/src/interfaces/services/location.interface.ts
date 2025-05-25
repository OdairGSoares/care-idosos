import { ILocationData } from "../../interfaces/repositories/locationFromDB.interface";

interface ILocationService {
  getLocations(): Promise<ILocationData[]>;
  getLocationById(locationId: string): Promise<ILocationData>;
}

export default ILocationService;