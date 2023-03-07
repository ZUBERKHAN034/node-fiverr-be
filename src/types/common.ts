import { Query } from 'express-serve-static-core';
export interface ServiceReturnVal<T> {
  error?: Error;
  data?: T;
  filePath?: string;
  mimeType?: string;
}
export interface APIResponse {
  success: boolean;
  details: any;
  headers?: any;
}
export interface RequestParams {
  [key: string]: any;
}
export interface Pagination {
  offset: number;
  limit: number;
}
export interface OrderType {
  orderBy: any;
  order: string;
}

export interface listAll extends Query {
  offset: string;
  limit: string;
  search?: string;
  orderBy: string;
  order: string;
}
export interface IdParams {
  id?: string;
}

export interface AuthParams {
  firstName?: string;
  lastName?: string;
  email: string;
  photo?: string;
  type?: string;
}
