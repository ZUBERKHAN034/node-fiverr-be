import { ParamsID } from './base';

export interface ConversationDetails extends ParamsID {
  to?: string;
  sellerId?: string;
  buyerId?: string;
  readBySeller?: string;
  readByBuyer?: string;
  lastMessage?: string;
}
