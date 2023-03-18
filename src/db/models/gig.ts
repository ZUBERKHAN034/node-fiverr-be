import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IGig extends Document {
  userId: Types.ObjectId;
  title: string;
  desc: string;
  totalStars?: number;
  starNumber?: number;
  cat: string;
  price: number;
  cover: string;
  images?: string[];
  shortTitle: string;
  shortDesc: string;
  deliveryTime: number;
  revisionNumber: number;
  features: string[];
  sales?: number;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Gig schema for mongoose
 * @type {Schema}
 */

const ObjectId = Schema.Types.ObjectId;
const GigSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    cat: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    shortTitle: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    revisionNumber: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: [true, 'One feature is required'],
      default: [],
    },
    sales: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Gig: mongoose.Model<IGig> = mongoose.models.Gig || mongoose.model<IGig>('Gig', GigSchema);

export default Gig;
