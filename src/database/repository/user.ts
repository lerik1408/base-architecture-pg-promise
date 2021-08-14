import { IDatabase } from 'pg-promise';

import queryBuilder from '../queryBuilder';
import BaseRepository from './base';

interface IColumn {
  id: number,
  fname: string,
  lname: string,
  isActive: boolean,
  username: string
  categoryId: number
}

interface IBeautifyUser extends Omit<IColumn, 'lname'|'fname'|'categoryId'> {
  fullName: string
}

export interface ICreateColumn extends Omit<IColumn, 'id'|'categoryId'|'isActive'> {
  isActive?: boolean;
}

export interface IUpdateColumn extends Omit<ICreateColumn, 'fname'|'lname'|'username'> {
  fname?: string,
  lname?: string,
  username?: string,
}

export default class UserRepository extends BaseRepository {
  private tableName: string = 'user';

  constructor(private db: IDatabase<any>) {
    super();
    this.db = db;
  }

  public handleError(err: unknown) {
    super.handleError(err);
  }

  public async findById(id: number): Promise<IColumn|undefined> {
    return this.db.oneOrNone(`SELECT * FROM "user" WHERE id = ${id}`)
      .catch((err) => this.handleError(err));
  }

  public async list() {
    return this.db.query('SELECT * FROM "user"')
      .catch((err) => this.handleError(err));
  }

  public async create(payload: ICreateColumn): Promise<IColumn> {
    const queryForInsert = queryBuilder.buildInsertQuery(payload, this.tableName);
    return this.db.query(queryForInsert)
      .then((usersFields) => usersFields[0])
      .catch((err) => this.handleError(err));
  }

  public async update(payload: IUpdateColumn, condition: string): Promise<IColumn> {
    const queryForUpdate = queryBuilder.buildUpdateQuery(payload, this.tableName, condition);
    return this.db.query(queryForUpdate)
      .then((usersFields) => usersFields[0])
      .catch((err) => this.handleError(err));
  }

  public async delete(condition: string): Promise<any> {
    const queryForDelete = queryBuilder.buildDeleteQuery(this.tableName, condition);
    return this.db.query(queryForDelete)
      .catch((err) => this.handleError(err));
  }

  static beautify(column: IColumn): IBeautifyUser {
    return {
      id: column.id,
      fullName: column.fname + column.lname,
      username: column.username,
      isActive: column.isActive,
    };
  }
}
