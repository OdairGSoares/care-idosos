export interface IContactsData {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isMainContact: boolean;
}

export interface IContactsDataWithoutId {
  name: string;
  phone: string;
  relationship: string;
  isMainContact: boolean;
}

interface IEmergencyContactsFromDBRepository {
  getEmergencyContactsFromDB(userId: string): Promise<IContactsData[]>;
  getEmergencyContactByIdFromDB(id: string, userId: string): Promise<IContactsData>;
  addEmergencyContactFromDB(data: IContactsDataWithoutId, userId: string): Promise<string>;
  updateEmergencyContactFromDB(
    id: string,
    data: IContactsDataWithoutId,
    userId: string
  ): Promise<string>;
  removeEmergencyContactFromDB(id: string, userId: string): Promise<string>;
}

export default IEmergencyContactsFromDBRepository;
