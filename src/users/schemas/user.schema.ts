import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  job: String,
  email: String,
}, { timestamps: true });

export const AvatarSchema = new Schema({
  userId: String,
  filePath: String,
  hash: String,
}, { timestamps: true });