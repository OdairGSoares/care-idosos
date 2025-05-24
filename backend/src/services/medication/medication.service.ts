import { inject, injectable } from 'tsyringe';
import IMedicationService from '../../interfaces/services/medication.interface';
import IMedicationFromDBRepository, { IMedicationsData, IMedicationsDataWithoutId } from '../../interfaces/repositories/medicationFromDB.interface';

@injectable()
class MedicationService implements IMedicationService {
  constructor(
    @inject('MedicationFromDBRepository')
    private medicationFromDBRepository: IMedicationFromDBRepository,
  ) {}

  async getMedications(userId: string): Promise<IMedicationsData[]> {
    const responseDB =
      await this.medicationFromDBRepository.getMedicationsFromDB(userId);

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    return responseDB || [];
  }

  async getMedicationById(id: string, userId: string): Promise<IMedicationsData> {
    const responseDB =
      await this.medicationFromDBRepository.getMedicationByIdFromDB(
        id,
        userId
      );

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    return responseDB;
  }

  async addMedication(
    data: IMedicationsDataWithoutId,
    userId: string
  ): Promise<string> {
    const responseDB =
      await this.medicationFromDBRepository.addMedicationFromDB(
        data,
        userId
      );

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    return responseDB;
  }

  async removeMedication(
    id: string,
    userId: string
  ): Promise<string> {
    const responseDB =
      await this.medicationFromDBRepository.removeMedicationFromDB(
        id,
        userId
      );

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    return responseDB;
  }

  async updateMedicationReminder(id: string, reminder: boolean, userId: string): Promise<string> {
    const responseDB =
      await this.medicationFromDBRepository.updateMedicationReminderFromDB(
        id,
        reminder,
        userId
      );

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    return responseDB;
  }

  async updateMedicationTaken(id: string, taken: boolean, userId: string): Promise<string> {
    const responseDB =
      await this.medicationFromDBRepository.updateMedicationTakenFromDB(
        id,
        taken,
        userId
      );

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    return responseDB;
  }

  async resetMedications(userId: string): Promise<string> {
    const responseDB =
      await this.medicationFromDBRepository.resetMedicationsFromDB(userId);

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    return responseDB;
  }
}

export default MedicationService;
