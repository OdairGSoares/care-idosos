import { inject, injectable } from 'tsyringe';
import { Body, Get, Path, Post, Route, Security, Tags } from 'tsoa';
import { IUserData, IUserDataLogin, IUserDataWithoutPassword, IUserDataWithoutUserId, IUserToken } from '../../interfaces/repositories/userFromDB.interface';
import UserService from '../../services/user/user.service';

@injectable()
@Route('user')
@Tags('Acesso de Usuário')
class UserController {
  constructor(
    @inject('UserService')
    private userService: UserService,
  ) {}

  @Post('/sign-up')
  async addUser(@Body() body: IUserDataWithoutUserId): Promise<IUserData> {
    try {
      const { userFirstName, userLastName, phone, email, password } = body;

      if (!userFirstName || !userLastName || !phone || !email || !password) {
        throw new Error('Resource is missing!');
      }

      const response = await this.userService.addUser(
        body, 
      );

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Post('/login')
  async loginUser(@Body() body: IUserDataLogin): Promise<IUserToken> {
    const { email, password } = body;

    try {
      if (typeof email !== 'string' || typeof password !== 'string') {
        throw new Error('Email and password are required.');
      }

      const response = await this.userService.loginUser(
        body,
      );

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;

    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Get('/')
  async getUsers(): Promise<IUserDataWithoutPassword[]> {
    try {
      const response = await this.userService.getUsers();

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }

  @Get('/:userId')
  async getLocationById(@Path() userId: string): Promise<IUserDataWithoutPassword> {
    try {
      if (!userId) {
        throw new Error('Resource is missing!');
      }

      const response = await this.userService.getUserById(userId);

      if (!response) {
        throw new Error('Resource not found!');
      }

      return response;
    } catch (error) {
      throw new Error(`Internal server error - ${error}`);
    }
  }
}

export default UserController;
