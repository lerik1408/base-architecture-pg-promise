import database from '../database';
import UserValidator from './validator';
import UserRepository from '../database/repository/user';
import UserPayloader from './payloader';

class UserService {
  private hasExist<T>(column: T): T {
    if (!column) {
      throw new Error('404');
    }
    return column;
  }

  public async retrieveUser(db: typeof database, id: number) {
    const userColumn = this.hasExist(await db.users.findById(id));
    return UserRepository.beautify(userColumn);
  }

  public async createUser(db: typeof database, body: any) {
    UserValidator.createUser(body);
    const payload = UserPayloader.createUserPayload(body);
    const userFields = await db.users.create(payload);
    return UserRepository.beautify(userFields);
  }

  public async updateUser(db: typeof database, userId: number, body: any) {
    UserValidator.updateUser(body);
    const payload = UserPayloader.updateUserPayload(body);
    const userFields = await db.users.update(payload, `id = ${userId}`);
    return UserRepository.beautify(userFields);
  }

  public async removeUser(db: typeof database, userId: number) {
    const condition = `id = ${userId}`;
    await db.users.delete(condition);
  }
}

export default new UserService();
