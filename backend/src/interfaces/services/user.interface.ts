import { IUserData, IUserDataLogin, IUserDataWithoutPassword, IUserDataWithoutUserId, IUserToken } from "../../interfaces/repositories/userFromDB.interface";

interface IUserService {
  addUser(
    data: IUserDataWithoutUserId
  ): Promise<IUserData>;
  getUsers(): Promise<IUserDataWithoutPassword[]>;
  getUserById(userId: string): Promise<IUserDataWithoutPassword>;
  loginUser(data: IUserDataLogin): Promise<IUserToken>;
}

export default IUserService;