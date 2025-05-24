import { IUserData, IUserDataLogin, IUserDataWithoutPassword, IUserDataWithoutUserId } from "../repositories/userFromDB.interface";

interface IUserService {
  addUser(
    data: IUserDataWithoutUserId
  ): Promise<IUserData>;
  getUsers(): Promise<IUserData[]>;
  getUserById(userId: string): Promise<IUserDataWithoutPassword>;
  loginUser(data: IUserDataLogin): Promise<string>;
}

export default IUserService;