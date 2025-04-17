import { User } from "@api/users/schemas/user.schema";
import { Types } from "mongoose";

export interface IProject {
  projectId: string;
  // For now, we are not using the userId field
  // but we can use it in the future to link the project to a user
  userId?: Types.ObjectId | User | string;
  name: string;
  description: string;
}
