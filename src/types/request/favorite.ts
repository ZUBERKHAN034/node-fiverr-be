import { ParamsID } from './base';

export interface FavoriteDetails extends ParamsID {
  gigId?: string;
  userId?: string;
  img?: string;
  title?: string;
  price?: string;
}
