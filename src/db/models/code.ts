import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICode extends Document {
  type: string;
  code: string;
  email: string;
  userId?: Types.ObjectId;
  createdAt: number;
  updatedAt: number;
}

const emailMatch: [RegExp, string] = [/([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z0-9])+/i, 'No email found ({VALUE})'];
/**
 * Code schema for mongoose
 * @type {Schema}
 */

const ObjectId = Schema.Types.ObjectId;
const CodeSchema = new Schema(
  {
    type: { type: String, required: [true, 'type required'] },
    code: { type: String, unique: true, required: [true, 'code required'] },
    email: {
      type: String,
      match: emailMatch,
      required: [true, 'email required'],
    },
    userId: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Code: mongoose.Model<ICode> = mongoose.models.Code || mongoose.model<ICode>('Code', CodeSchema);

export default Code;
