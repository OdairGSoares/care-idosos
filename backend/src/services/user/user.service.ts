import { inject, injectable } from 'tsyringe';
import IUserService from '../../interfaces/services/user.interface';
import IUserFromDBRepository, { IUserData, IUserDataLogin, IUserDataWithoutPassword, IUserDataWithoutUserId } from '../../interfaces/repositories/userFromDB.interface';
import { generateToken } from '../../middlewares/jwtAuthentication';

@injectable()
class UserService implements IUserService {
  constructor(
    @inject('UserFromDBRepository')
    private userFromDBRepository: IUserFromDBRepository,
  ) {}

async addUser(
    data: IUserDataWithoutUserId
  ): Promise<IUserData> {
    const responseDB =
      await this.userFromDBRepository.addUserFromDB(data);

    if (!responseDB) {
      throw new Error('Data not found!');
    }
    
    return responseDB;
  }

  async loginUser(
    data: IUserDataLogin
  ): Promise<string> {
    let accessToken = "";

    const responseDB = await this.userFromDBRepository.getUserCheckFromDB(data);

    if (!responseDB) {
      throw new Error("User not exists!");
    }
    
    if (
      responseDB.userId && 
      responseDB.email === data.email &&
      responseDB.password === data.password
    ) {
      accessToken = generateToken({
        userId: responseDB.userId,
        email: responseDB.email,
      });
    }

    if (!accessToken) {
      throw new Error("Invalid credentials!");
    }

    return accessToken;
  }

  async getUsers(): Promise<IUserData[]> {
    const responseDB =
      await this.userFromDBRepository.getUsersFromDB();

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    return responseDB;
  }

  async getUserById(userId: string): Promise<IUserDataWithoutPassword> {
    const responseDB =
      await this.userFromDBRepository.getUserByIdFromDB(
        userId,
      );

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    return responseDB;
  }
}

export default UserService;
