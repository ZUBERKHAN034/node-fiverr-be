import { ParamsID } from './base';

export interface ReviewDetails extends ParamsID {
  gigId?: string;
  userId?: string;
  star?: string;
  desc?: string;
}
