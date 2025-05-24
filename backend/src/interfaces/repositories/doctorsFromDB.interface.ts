export interface IDoctorsData {
    doctorId: string, 
    doctorName: string, 
    specialty: string,
    image?: string;
};

interface IDoctorFromDBRepository {
  getDoctorsFromDB(): Promise<IDoctorsData[]>;
  getDoctorByIdFromDB(doctorId: string): Promise<IDoctorsData>;
}

export default IDoctorFromDBRepository;