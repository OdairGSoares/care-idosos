import { get } from '@/utils/apiService';
import type { ILocationData } from '@/types/api';

/**
 * Serviços para gerenciamento de localizações/clínicas
 */
export class LocationService {
  
  /**
   * Lista todas as localizações/clínicas disponíveis
   */
  static async getLocations(): Promise<ILocationData[] | null> {
    return get<ILocationData[]>('/location');
  }

  /**
   * Busca uma localização específica por ID
   */
  static async getLocationById(locationId: string): Promise<ILocationData | null> {
    return get<ILocationData>(`/location/${locationId}`);
  }

  /**
   * Busca localizações por cidade
   */
  static async getLocationsByCity(city: string): Promise<ILocationData[] | null> {
    const locations = await this.getLocations();
    if (!locations) return null;
    
    return locations.filter(location => 
      location.locationCity.toLowerCase().includes(city.toLowerCase())
    );
  }

  /**
   * Busca localizações por nome
   */
  static async getLocationsByName(name: string): Promise<ILocationData[] | null> {
    const locations = await this.getLocations();
    if (!locations) return null;
    
    return locations.filter(location => 
      location.locationName.toLowerCase().includes(name.toLowerCase())
    );
  }
} 