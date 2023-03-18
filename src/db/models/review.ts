import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  gigId: Types.ObjectId;
  userId: Types.ObjectId;
  star: number;
  desc: string;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Review schema for mongoose
 * @type {Schema}
 */

const ObjectId = Schema.Types.ObjectId;
const ReviewSchema = new Schema(
  {
    gigId: {
      type: ObjectId,
      ref: 'Gig',
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    star: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review: mongoose.Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
