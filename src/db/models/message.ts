import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  userId: Types.ObjectId;
  desc: string;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Message schema for mongoose
 * @type {Schema}
 */

const ObjectId = Schema.Types.ObjectId;
const MessageSchema = new Schema(
  {
    conversationId: {
      type: ObjectId,
      ref: 'Conversation',
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message: mongoose.Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
