import { User } from "@api/users/interfaces/user.interface";
import { Types } from "mongoose";

export interface UserProject {
  userId: Types.ObjectId | User | string;
  projectId: string;
}