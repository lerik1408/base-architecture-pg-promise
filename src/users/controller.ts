import { CustomContext } from '../types/shared';
import UserService from './service';

export default class UserController {
  static async retrieveUser(ctx: CustomContext) {
    const { userId } = ctx.params;

    const user = await UserService.retrieveUser(ctx.db, userId);

    ctx.body = user;
  }

  static async createUser(ctx: CustomContext) {
    const { body } = ctx.request;
    const user = await UserService.createUser(ctx.db, body);
    ctx.status = 201;
    ctx.body = user;
  }

  static async updateUser(ctx: CustomContext) {
    const { userId } = ctx.params;
    const { body } = ctx.request;
    const user = await UserService.updateUser(ctx.db, userId, body);
    ctx.body = user;
  }

  static async removeUser(ctx: CustomContext) {
    const { userId } = ctx.params;
    await UserService.removeUser(ctx.db, userId);
    ctx.status = 204;
  }
}
