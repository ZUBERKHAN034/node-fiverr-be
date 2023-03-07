import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  id: string;
  sellerId: string;
  buyerId: string;
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

const ConversationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
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
