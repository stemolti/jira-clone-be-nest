import { User } from "@api/users/schemas/user.schema";
import { Types } from "mongoose";

export interface Project {
  projectId: string;
  userId?: Types.ObjectId | User | string;
  name: string;
  description: string;
}
