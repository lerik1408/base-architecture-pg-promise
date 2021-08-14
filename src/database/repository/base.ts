/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import constraints from '../constraints';

import { DataBaseSyntaxError, DataBaseConstraintError } from '../../utils/errors';

export default abstract class Repository {
  abstract findById(id: number): Promise<any>;

  abstract list(): Promise<any[]>;

  abstract create(payload: object): Promise<any>;

  abstract delete(condition: string): Promise<any>;

  abstract update(payload: object, condition: string): Promise<any>;

  public handleError(err: any) {
    if (err.constraint) {
      let errorParam = constraints[err.constraint];
      if (!errorParam) {
        errorParam = constraints.other;
      }
      throw new DataBaseConstraintError(errorParam.message, errorParam.status, errorParam.isShowing);
    }
    throw new DataBaseSyntaxError(err.message, 500);
  }
}
