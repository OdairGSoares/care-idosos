export interface IMedicationsData {
    id: string;
    name: string;
    dosage: number;
    time: string;
}

export interface IMedicationsDataWithoutId {
    name: string;
    dosage: number;
    time: string;
  }

interface IMedicationFromDBRepository {
    getMedicationsFromDB(userId: string): Promise<IMedicationsData[]>;
    getMedicationByIdFromDB(id: string, userId: string): Promise<IMedicationsData>;
    addMedicationFromDB(data: IMedicationsDataWithoutId, userId: string): Promise<string>;
    removeMedicationFromDB(id: string, userId: string): Promise<string>;
    updateMedicationReminderFromDB(id: string, reminder: boolean, userId: string): Promise<string>;
    updateMedicationTakenFromDB(id: string, taken: boolean, userId: string): Promise<string>;
    resetMedicationsFromDB(userId: string): Promise<string>;
}
  
export default IMedicationFromDBRepository;