import { injectable } from 'tsyringe';
import databaseConfig from '../../database/databaseConfig';
import IUserFromDBRepository, { IUserData, IUserDataCheck, IUserDataLogin, IUserDataWithoutPassword, IUserDataWithoutUserId } from '../../interfaces/repositories/userFromDB.interface';

@injectable()
class UserFromDBRepository
  implements IUserFromDBRepository
{
  private db;

  constructor() {
    this.db = databaseConfig.firestore().collection('users');
  }

  async addUserFromDB(
    data: IUserDataWithoutUserId
  ): Promise<IUserData> {
    const refDB = this.db;

    const docRef = await refDB.add({
      userFirstName: data.userFirstName,
      userLastName: data.userLastName,
      phone: data.phone,
      email: data.email,
      password: data.password
    });

    docRef.update({ userId: docRef.id });

    return {
      userId: docRef.id,
       userFirstName: data.userFirstName,
      userLastName: data.userLastName,
      phone: data.phone,
      email: data.email,
      password: data.password
    };
  }

  async getUsersFromDB(): Promise<IUserDataWithoutPassword[]> {
    const refDB = await this.db.get();

    const usersList = refDB.docs.map((doc) => {
      const docData = doc.data() as IUserData;

      if (docData) {
        return { ...docData, password: docData.password };
      } else {
        throw new Error('Document not found!');
      }
    });

    return usersList;
  }

  async getUserByIdFromDB(
    userId: string,
  ): Promise<IUserDataWithoutPassword> {
    const refDB = await this.db.doc(userId).get();

    if (refDB.exists) {
      const data = refDB.data() as IUserData;

      if (data) {
        return data;
      } else {
        throw new Error('User not found!');
      }
    } else {
      throw new Error('Document not found!');
    }
  }

  async getUserCheckFromDB(
    data: IUserDataLogin
  ): Promise<IUserDataCheck> {
    const refDB = this.db
      .where('email', '==', data.email)
      .where('password', '==', data.password);

    const snapshot = await refDB.get();
    const doc = snapshot.docs[0];
    const dataDoc = doc.data() as IUserData;

    if (data) {
      return {
        userId: dataDoc.userId,
        email: data.email,
        password: data.password,
      };
    } else {
      throw new Error('User not found!');
    }
  }
}

export default UserFromDBRepository;