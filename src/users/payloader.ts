/* eslint-disable class-methods-use-this */
import {
  ICreateColumn as IPayloadForCreate,
  IUpdateColumn as IPayloadForUpdate,
} from '../database/repository/user';
import { ICreateUserBody, IUpdateUserBody } from './validator';

class IUserPayloader {
  private fieldExist(field: any): boolean {
    return typeof field !== 'undefined';
  }

  public createUserPayload(body: ICreateUserBody): IPayloadForCreate {
    const payload: IPayloadForCreate = {
      fname: body.firstName,
      lname: body.sureName,
      username: body.userName,
    };

    if (this.fieldExist(body.isActive)) {
      payload.isActive = body.isActive;
    }
    return payload;
  }

  public updateUserPayload(body: IUpdateUserBody): IPayloadForUpdate {
    const payload: IPayloadForUpdate = {};
    if (this.fieldExist(body.firstName)) {
      payload.fname = body.firstName;
    }
    if (this.fieldExist(body.sureName)) {
      payload.lname = body.sureName;
    }
    if (this.fieldExist(body.isActive)) {
      payload.isActive = body.isActive;
    }
    if (this.fieldExist(body.userName)) {
      payload.username = body.userName;
    }

    return payload;
  }
}

export default new IUserPayloader();
