import { CustomContext } from '../../types/shared';
import { BaseError } from '../errors';

export async function errorHandler(ctx: CustomContext, next: () => Promise<any>) {
  try {
    await next();
  } catch (error: any | BaseError) {
    let message = 'Something went wrong';
    let status = 500;
    if (error instanceof BaseError) {
      if (error.isShowing) {
        message = error.message;
        status = error.status;
      } else {
        console.log(error);
      }
    } else {
      console.log(error);
    }
    ctx.status = status;
    ctx.body = {
      error: message,
    };
  }
}
