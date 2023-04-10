import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFavorite extends Document {
  gigId: Types.ObjectId;
  userId: Types.ObjectId;
  img: string;
  title: string;
  price: number;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Order schema for mongoose
 * @type {Schema}
 */

const ObjectId = Schema.Types.ObjectId;
const FavoriteSchema = new Schema(
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
  },
  { timestamps: true }
);

const Favorite: mongoose.Model<IFavorite> =
  mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);
export default Favorite;
