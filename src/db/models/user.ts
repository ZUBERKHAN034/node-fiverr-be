import mongoose, { Document, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  country: string;
  img: string;
  phone: string;
  desc: string;
  isSeller: boolean;
  createdAt?: number;
  updatedAt?: number;
}

//Validation match
const phoneMatch: [RegExp, string] = [/[\+0-9]+/, 'No valid phone number found ({VALUE})'];
const emailMatch: [RegExp, string] = [
  /([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z0-9])+/i,
  'No valid email found ({VALUE})',
];

/**
 * User schema for mongoose
 * @type {Schema}
 */

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, 'Username already exists'],
    },
    email: {
      type: String,
      match: emailMatch,
      unique: [true, 'Email already exists'],
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    phone: {
      match: phoneMatch,
      type: String,
    },
    desc: {
      type: String,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Bcrypt middleware on userSchema
UserSchema.pre('save', function (next) {
  const user: IUser = this as IUser;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      return next();
    });
  });
});

const User: mongoose.Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
