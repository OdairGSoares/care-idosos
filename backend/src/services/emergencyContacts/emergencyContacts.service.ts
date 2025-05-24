import { inject, injectable } from 'tsyringe';
import IEmergencyContactsService from '../../interfaces/services/emergencyContacts.interface';
import IEmergencyContactsFromDBRepository, {
  IContactsData,
  IContactsDataWithoutId,
} from '../../interfaces/repositories/emergencyContactsFromDB.interface';

@injectable()
class EmergencyContactsService implements IEmergencyContactsService {
  constructor(
    @inject('EmergencyContactsFromDBRepository')
    private emergencyContactsFromDBRepository: IEmergencyContactsFromDBRepository,
  ) {}

  async getEmergencyContacts(userId: string): Promise<IContactsData[]> {
    const contactListFromDB =
      await this.emergencyContactsFromDBRepository.getEmergencyContactsFromDB(userId);

    if (!contactListFromDB) {
      throw new Error('Contact list not found!');
    }

    return contactListFromDB || [];
  }

  async getEmergencyContactById(id: string, userId: string): Promise<IContactsData> {
    const contactFromDB =
      await this.emergencyContactsFromDBRepository.getEmergencyContactByIdFromDB(
        id,
        userId
      );

    if (!contactFromDB) {
      throw new Error('Contact not found!');
    }

    return contactFromDB;
  }

  async addEmergencyContact(data: IContactsDataWithoutId, userId: string): Promise<string> {
    const addContactOnDB =
      await this.emergencyContactsFromDBRepository.addEmergencyContactFromDB(
        data,
        userId
      );

    if (!addContactOnDB) {
      throw new Error('The contact has not been added. Please try again!');
    }

    return addContactOnDB;
  }

  async updateEmergencyContact(
    id: string,
    data: IContactsDataWithoutId,
    userId: string
  ): Promise<string> {
    const updateContactOnDB =
      await this.emergencyContactsFromDBRepository.updateEmergencyContactFromDB(
        id,
        data,
        userId
      );

    if (!updateContactOnDB) {
      throw new Error('Contact updated successfully!');
    }

    return updateContactOnDB;
  }

  async removeEmergencyContact(id: string, userId: string): Promise<string> {
    const updateContactOnDB =
      await this.emergencyContactsFromDBRepository.removeEmergencyContactFromDB(
        id,
        userId
      );

    if (!updateContactOnDB) {
      throw new Error('Contact removed successfully!');
    }

    return updateContactOnDB;
  }
}

export default EmergencyContactsService;
