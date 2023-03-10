import { ParamsID } from './base';

export interface UserDetails extends ParamsID {
  username?: string;
  email?: string;
  password?: string;
  country?: string;
  img?: string;
  phone?: string;
  desc?: string;
  isSeller?: string;
}

export interface TokenUser {
  _id: string;
  username: string;
  email: string;
  country: string;
  isSeller: boolean;
}
