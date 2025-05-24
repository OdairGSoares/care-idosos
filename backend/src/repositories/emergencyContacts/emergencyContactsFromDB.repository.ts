import { injectable } from 'tsyringe';
import databaseConfig from '../../database/databaseConfig';
import IEmergencyContactsFromDBRepository, {
  IContactsData,
  IContactsDataWithoutId,
} from '../../interfaces/repositories/emergencyContactsFromDB.interface';

@injectable()
class EmergencyContactsFromDBRepository
  implements IEmergencyContactsFromDBRepository
{
  private contactsDB;

  constructor() {
    this.contactsDB = databaseConfig.firestore().collection('contacts');
  }

  async getEmergencyContactsFromDB(userId: string): Promise<IContactsData[]> {
    const refDB = await this.contactsDB.where('userId', '==', userId).get();

    const contactList = refDB.docs.map((doc) => {
      const docData = doc.data() as IContactsData;

      if (docData) {
        return docData;
      } else {
        throw new Error('Contact list not available!');
      }
    });

    return contactList;
  }

  async getEmergencyContactByIdFromDB(
    id: string,
    userId: string
  ): Promise<IContactsData> {
    const refDB = await this.contactsDB.doc(id).get();
    const data = refDB.data() as IContactsData;
    const userRefDB = await this.contactsDB.where('userId', '==', userId).get();
    if (refDB.exists && userRefDB.docs.length > 0) {
      const data = refDB.data();

      if (data) {
        return {
          id: data.id,
          name: data.name,
          phone: data.phone,
          relationship: data.relationship,
          isMainContact: data.isMainContact,
        };
      } else {
        throw new Error('Contact not found!');
      }
    } else {
      throw new Error('Document not found!');
    }
  }

  async addEmergencyContactFromDB(
    data: IContactsDataWithoutId,
    userId: string
  ): Promise<string> {
    const refDB = this.contactsDB;
    const docRef = await refDB.add({
      userId: userId,
      name: data.name,
      phone: data.phone,
      relationship: data.relationship,
      isMainContact: data.isMainContact,
    });

    docRef.update({ id: docRef.id });

    return 'Contact added successfully!';
  }

  async updateEmergencyContactFromDB(
    id: string,
    data: IContactsDataWithoutId,
    userId: string
  ): Promise<string> {
      const refDB = this.contactsDB;
      refDB.where('userId', '==', userId).get();
      
      refDB.doc(id).update({ 
        name: data.name,
        phone: data.phone,
        relationship: data.relationship,
        isMainContact: data.isMainContact,
      });

      return 'Playlist name updated successfully!';
      } 

  async removeEmergencyContactFromDB(id: string, userId: string): Promise<string> {
    const refDB = this.contactsDB.doc(id);
    const docSnap = await refDB.get();

    if (!docSnap.exists) {
      throw new Error('Document not found!');
    } 

    const data = docSnap.data();
    if (data?.userId !== userId) {
      throw new Error('Unauthorized to delete this contact!');
    }

    await refDB.delete(); 

    return 'Contact removed successfully!';
  }
}


export default EmergencyContactsFromDBRepository;
