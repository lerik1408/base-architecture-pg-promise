interface IConstraintMessage {
  [key: string]: {
    message: string,
    status: number,
    isShowing: boolean,
   }
}

const constraints: IConstraintMessage = {
  user_username_key: {
    message: 'username is exists',
    status: 400,
    isShowing: true,
  },
  user_pkey: {
    message: 'user id exists',
    status: 500,
    isShowing: false,
  },
  other: {
    message: 'Not handle constraint',
    status: 500,
    isShowing: false,
  },
};

export default constraints;
