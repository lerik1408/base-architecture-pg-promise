import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import db from './database';

import userRouter from './users/router';

import { errorHandler } from './utils/middleware/errorsCatcher';

const app = new Koa();

app.use(bodyParser());
app.use(errorHandler);

app.context.db = db;

app.use(userRouter.routes());

app.listen(3000, () => {
  console.log(`Server run on ${3000}`);
});
