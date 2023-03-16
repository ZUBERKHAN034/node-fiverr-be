import { Query } from 'express-serve-static-core';
import { ParamsID } from './base';

export interface GigDetails extends ParamsID {
  title?: string;
  desc?: string;
  totalStars?: string;
  starNumber?: string;
  cat?: string;
  price?: string;
  cover?: string;
  images?: string[];
  shortTitle?: string;
  shortDesc?: string;
  deliveryTime?: string;
  revisionNumber?: string;
  features?: string[];
  sales?: string;
}

export interface SearchParams extends Query {
  userId?: string;
  cat?: string;
  min?: string;
  max?: string;
  search?: string;
  sort?: string;
}
