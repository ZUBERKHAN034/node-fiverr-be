import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  gigId: string;
  userId: string;
  star: number;
  desc: string;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Review schema for mongoose
 * @type {Schema}
 */

const ReviewSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
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
