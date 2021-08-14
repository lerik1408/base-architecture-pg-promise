import pgPromise, { IInitOptions, IDatabase } from 'pg-promise';
import { IRepositories, UserRepository } from './repository';

type ExtendedProtocol = IDatabase<IRepositories> & IRepositories

const conf = {
  host: process.env.DB_PG_HOST,
  port: +process.env.DB_PG_PORT,
  database: process.env.DB_PG_DB,
  user: process.env.DB_PG_USER,
  password: process.env.DB_PG_PASSWORD,
};
const initialOption: IInitOptions<IRepositories> = {
  error(err, e) {
    console.error('query: ', e.query);
    console.error('params: ', e.params);
  },

  extend(obj: ExtendedProtocol) {
    // eslint-disable-next-line no-param-reassign
    obj.users = new UserRepository(obj);
  },
};
const pgp = pgPromise(initialOption);

const db = pgp(conf);

export default db;
