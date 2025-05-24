export interface ILocationData {
    locationId: string, 
    locationName: string, 
    locationAddress: string
    locationCity: string
};

interface ILocationFromDBRepository {
  getLocationsFromDB(): Promise<ILocationData[]>;
  getLocationByIdFromDB(locationId: string): Promise<ILocationData>;
}

export default ILocationFromDBRepository;