import { Query } from 'express-serve-static-core';

export interface CreateUser extends Query {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Login extends Query {
  email: string;
  password: string;
}
