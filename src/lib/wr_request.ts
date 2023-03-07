import { Query } from 'express-serve-static-core';
import { TokenUser } from '../types/request/user';

export default interface WRRequest<T extends Query, U, V = undefined> extends Express.Request {
  body: U;
  query: T;
  params: V;
  currentUser: TokenUser;
}
