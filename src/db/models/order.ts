import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrder extends Document {
  gigId: Types.ObjectId;
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
