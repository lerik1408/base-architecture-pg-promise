import joi from 'joi';
import { ValidationError } from '../utils/errors';

export interface ICreateUserBody {
  firstName: string,
  sureName: string,
  userName: string,
  isActive?: boolean,
}

export interface IUpdateUserBody {
  firstName?: string,
  userName?: string,
  sureName?: string,
  isActive?: boolean,
}

class UserValidator {
  private checkValidationError = (result: joi.ValidationResult) => {
    if (result.error) {
      throw new ValidationError(result.error.message);
    }
    return result.value;
  }

  private createUserSchema = joi.object({
    firstName: joi.string().required(),
    sureName: joi.string().required(),
    userName: joi.string().required(),
    isActive: joi.boolean(),
  });

  private updateUserSchema = joi.object({
    firstName: joi.string(),
    sureName: joi.string(),
    userName: joi.string(),
    isActive: joi.bool(),
  }).required();

  public createUser(body: any): void {
    this.checkValidationError(this.createUserSchema.validate(body));
  }

  public updateUser(body: any): void {
    this.checkValidationError(this.updateUserSchema.validate(body));
  }
}

export default new UserValidator();
