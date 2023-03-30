import { ParamsID } from './base';

export interface MessageDetails extends ParamsID {
  conversationId?: string;
  desc?: string;
}
