import { Query } from 'express-serve-static-core';
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
  gender?: string;
}

export interface SetupAcctProfile extends Query {
  img?: string;
  phone?: string;
  desc?: string;
}
