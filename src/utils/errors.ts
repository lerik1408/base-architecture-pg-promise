/* eslint-disable max-classes-per-file */
export class BaseError extends Error {
  readonly isCustom: boolean = true;

  public isShowing: boolean = true;

  public status: number;

  constructor(message: string, name: string, status: number) {
    super(message);
    this.status = status;
    this.name = name;
  }
}

export class DataBaseSyntaxError extends BaseError {
  constructor(message: string, status: number) {
    super(message, 'DataBaseSyntaxError', status);
    this.isShowing = false;
  }
}

export class DataBaseConstraintError extends BaseError {
  constructor(message: string, status: number, isShowing: boolean) {
    super(message, 'DataBaseConstraintError', status);
    this.isShowing = isShowing;
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, 'ValidationError', 400);
  }
}
