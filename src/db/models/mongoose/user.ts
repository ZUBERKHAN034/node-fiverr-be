import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt?: number;
  updatedAt?: number;
  role: 'admin' | 'user';
}

let Schema = mongoose.Schema;

//Validation match
// let phone_match = [/[\+0-9]+/, "No phone number found ({VALUE})"];
let emailMatch: [RegExp, string] = [/([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z0-9])+/i, 'No email found ({VALUE})'];
/**
 * User schema for mongoose
 * @type {Schema}
 */

let UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    email: {
      type: String,
      match: emailMatch,
      unique: [true, 'Email already exists'],
    },
    password: { type: String },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Bcrypt middleware on UserSchema
UserSchema.pre('save', function (next) {
  var user: IUser = this as IUser;
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
