export interface IUserData {
    userId: string, 
    userFirstName: string, 
    userLastName: string
    phone: string,
    email: string,
    password: string,
};

export interface IUserDataLogin {
    email: string,
    password: string,
};

export interface IUserToken {
    userId: string,
    token: string,
    email: string,
};

export interface IUserDataCheck {
    userId: string,
    email: string,
    password: string,
};

export interface IUserDataWithoutUserId {
    userFirstName: string, 
    userLastName: string
    phone: string,
    email: string,
    password: string,
};

export interface IUserDataWithoutPassword {
    userId: string, 
    userFirstName: string, 
    userLastName: string
    phone: string,
    email: string,
};


interface IUserFromDBRepository {
  addUserFromDB(
    data: IUserDataWithoutUserId
  ): Promise<IUserData>;
  getUsersFromDB(): Promise<IUserDataWithoutPassword[]>;
  getUserByIdFromDB(userId: string): Promise<IUserDataWithoutPassword>;
  getUserCheckFromDB(data: IUserDataLogin): Promise<IUserDataCheck>;
}

export default IUserFromDBRepository;