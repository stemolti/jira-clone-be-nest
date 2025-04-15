import { User } from "@api/users/schemas/user.schema";
import { Types } from "mongoose";

export interface Project {
  projectId: Types.ObjectId | Project;
  userId?: Types.ObjectId | User;
  name: string;
  description: string;
}
