import { Query } from 'express-serve-static-core';

export interface UserDetails extends Query {
  username: string;
  email: string;
  password: string;
  country: string;
  img: string;
  phone: string;
  desc: string;
  isSeller: string;
}
