import UserRepository from './user';

interface IRepositories {
  users: UserRepository,
}

export { IRepositories, UserRepository };
