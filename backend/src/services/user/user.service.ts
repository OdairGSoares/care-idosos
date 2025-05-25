import { inject, injectable } from 'tsyringe';
import IUserService from '../../interfaces/services/user.interface';
import IUserFromDBRepository, { IUserData, IUserDataLogin, IUserDataWithoutPassword, IUserDataWithoutUserId, IUserToken } from '../../interfaces/repositories/userFromDB.interface';
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
  ): Promise<IUserToken> {
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

    return {
      userId: responseDB.userId,
      email: responseDB.email,
      token: accessToken,
    };
  }

  async getUsers(): Promise<IUserDataWithoutPassword[]> {
    const responseDB =
      await this.userFromDBRepository.getUsersFromDB();

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    const data = responseDB.map((user) => {
      const userData = {
        userId: user.userId,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        phone: user.phone,
        email: user.email
      }
      
      return userData;
    })

    return data;
  }

  async getUserById(userId: string): Promise<IUserDataWithoutPassword> {
    const responseDB =
      await this.userFromDBRepository.getUserByIdFromDB(
        userId,
      );

    if (!responseDB) {
      throw new Error('Data not found!');
    }

    const data = {
      userId: responseDB.userId,
      userFirstName: responseDB.userFirstName,
      userLastName: responseDB.userLastName,
      phone: responseDB.phone,
      email: responseDB.email
    }

    return data;
  }
}

export default UserService;
