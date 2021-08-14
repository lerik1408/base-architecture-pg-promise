import Router from 'koa-router';

import { CustomContext } from '../types/shared';
import UserController from './controller';

const userRouter = new Router<{}, CustomContext>({ prefix: '/users' });

userRouter.param('userId', async (param, ctx, next) => {
  if (Number.isNaN(+param)) {
    console.log('throw Error');
  }
  await next();
});

userRouter.get('/:userId', UserController.retrieveUser);
userRouter.put('/:userId', UserController.updateUser);
userRouter.delete('/:userId', UserController.removeUser);
userRouter.post('/', UserController.createUser);

export default userRouter;
