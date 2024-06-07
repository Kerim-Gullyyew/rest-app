import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly job: string;
  readonly email: string;
}

export interface UserFromRegres extends Document {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly avatar: string;
}


export interface Avatar extends Document {
  readonly userId: string;
  readonly filePath: string;
  readonly hash: string;
}