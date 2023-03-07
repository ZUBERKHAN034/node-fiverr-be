import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  gigId: string;
  img?: string;
  title: string;
  price: number;
  sellerId: string;
  buyerId: string;
  isCompleted?: boolean;
  paymentIntent: string;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Order schema for mongoose
 * @type {Schema}
 */

const OrderSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    paymentIntent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order: mongoose.Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
