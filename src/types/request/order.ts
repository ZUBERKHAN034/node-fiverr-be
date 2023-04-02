import { ParamsID } from './base';

export interface OrderDetails extends ParamsID {
  gigId?: string;
  img?: string;
  title?: string;
  price?: string;
  sellerId?: string;
  buyerId?: string;
  isCompleted?: string;
  paymentIntent?: string;
}

export interface StripeSignature {
  signature: string;
}
