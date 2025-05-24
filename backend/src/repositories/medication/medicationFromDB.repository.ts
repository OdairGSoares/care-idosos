import { injectable } from 'tsyringe';
import databaseConfig from '../../database/databaseConfig';
import IMedicationFromDBRepository, { IMedicationsData, IMedicationsDataWithoutId } from '../../interfaces/repositories/medicationFromDB.interface';

@injectable()
class MedicationFromDBRepository
  implements IMedicationFromDBRepository
{
  private db;

  constructor() {
    this.db = databaseConfig.firestore().collection('medications');
  }

  async getMedicationsFromDB(userId: string): Promise<IMedicationsData[]> {
      const refDB = await this.db.where('userId', '==', userId).get();

      const medicationList = refDB.docs.map((doc) => {
        const docData = doc.data() as IMedicationsData;

        if (docData) {
          return docData;
        } else {
          throw new Error('Document not found!');
        }
      });

      return medicationList;
  }

  async getMedicationByIdFromDB(
    id: string,
    userId: string
  ): Promise<IMedicationsData> {
    const querySnapshot = await this.db.where('userId', '==', userId).get();
    const doc = querySnapshot.docs.find((doc) => doc.id === id);

    if (doc && doc.exists) {
      const data = doc.data() as IMedicationsData;

      if (data) {
        return data;
      } else {
        throw new Error('Data not found!');
      }
    } else {
      throw new Error('Document not found!');
    }
  }

  async addMedicationFromDB(
    data: IMedicationsDataWithoutId,
    userId: string
  ): Promise<string> {
    const refDB = this.db;
    const docRef = refDB.doc();
    const id = docRef.id;

    const docData = await refDB.get();
    docData.docs.map((doc) => {
      if (data.name === doc.data().name) {
        console.error('Medication already exists!');
        throw new Error('Medication already exists!');
      }
    })

    await docRef.set({
      id: id,
      name: data.name,
      dosage: data.dosage,
      time: data.time,
      userId: userId,

    })

    return 'Medication added successfully!';
  }

  async removeMedicationFromDB(id: string): Promise<string> {
    const refDB = await this.db.doc(id).get();

    if (refDB.exists) {
      refDB.ref.delete();

      return 'Medication removed successfully!';
    } else {
      throw new Error('Document not found!');
    }
  }

  async updateMedicationReminderFromDB(
    id: string,
    reminder: boolean, 
    userId: string
  ): Promise<string> {
    const refDB = await this.db.where('userId', '==', userId).get();
    const docRef = refDB.docs.find((doc) => doc.id === id);
    
    if (!docRef) {
      throw new Error('Document not found!');
    }

    docRef.ref.update({
        reminder: reminder, 
    });

    return 'Medication updated successfully!';
  }

  async updateMedicationTakenFromDB(
    id: string,
    taken: boolean, 
    userId: string
  ): Promise<string> {
    const refDB = await this.db.where('userId', '==', userId).get();
    const docRef = refDB.docs.find((doc) => doc.id === id);
    
    if (!docRef) {
      throw new Error('Document not found!');
    }

    docRef.ref.update({
      taken: taken
    });

    return 'Medication updated successfully!';
  }

  async resetMedicationsFromDB(userId: string): Promise<string> {
    const refDB = await this.db.where('userId', '==', userId).get();

    refDB.docs.map((doc) => {
      const data = doc.data() as IMedicationsData;

      if (data) {
        doc.ref.update({
          taken: false,
          reminder: false,
        });
      } else {
        throw new Error('Document not found!');
      }
    })

    return 'Medications have been reset successfully!';
  } 
}

export default MedicationFromDBRepository;
