import { Context } from 'koa';
import db from '../database/index';

export interface CustomContext extends Context {
  db: typeof db,
}
