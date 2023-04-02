import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrder extends Document {
  gigId: Types.ObjectId;
  img: string;
  title: string;
  price: number;
  sellerId: Types.ObjectId;
  buyerId: Types.ObjectId;
  isCompleted?: boolean;
  paymentUrl?: string;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Order schema for mongoose
 * @type {Schema}
 */

const ObjectId = Schema.Types.ObjectId;
const OrderSchema = new Schema(
  {
    gigId: {
      type: ObjectId,
      ref: 'Gig',
      required: true,
    },
    img: {
      type: String,
      required: true,
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
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    buyerId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    paymentUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order: mongoose.Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
