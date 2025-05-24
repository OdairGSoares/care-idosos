import { IContactsData, IContactsDataWithoutId } from '../repositories/emergencyContactsFromDB.interface';

interface IEmergencyContactsService {
  getEmergencyContacts(userId: string): Promise<IContactsData[]>;
  getEmergencyContactById(id: string, userId: string): Promise<IContactsData>;
  addEmergencyContact(data: IContactsDataWithoutId, userId: string): Promise<string>;
  updateEmergencyContact(
    id: string,
    data: IContactsDataWithoutId,
    userId: string
  ): Promise<string>;
  removeEmergencyContact(id: string, userId: string): Promise<string>;
}

export default IEmergencyContactsService;
