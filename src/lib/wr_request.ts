import { Query } from 'express-serve-static-core';
import { TokenUser } from '../types/request/base';

export default interface WRRequest<T extends Query, U, V = undefined> extends Express.Request {
  query: T;
  body: U;
  params: V;
  currentUser: TokenUser;
}
