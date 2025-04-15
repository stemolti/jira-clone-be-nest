import { Types } from "mongoose";

export interface User {
  userId?: Types.ObjectId | User;
  name: string;
  email: string;
}
