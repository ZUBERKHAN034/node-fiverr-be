import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IConversation extends Document {
  sellerId: Types.ObjectId;
  buyerId: Types.ObjectId;
  readBySeller: boolean;
  readByBuyer: boolean;
  lastMessage?: string;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Conversation schema for mongoose
 * @type {Schema}
 */
const ObjectId = Schema.Types.ObjectId;
const ConversationSchema = new Schema(
  {
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
    readBySeller: {
      type: Boolean,
      required: true,
    },
    readByBuyer: {
      type: Boolean,
      required: true,
    },
    lastMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

const Conversation: mongoose.Model<IConversation> =
  mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
