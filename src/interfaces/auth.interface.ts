import { User } from 'auth0';
import { Request } from 'express';

export interface DataStoredInToken {
  sub: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
