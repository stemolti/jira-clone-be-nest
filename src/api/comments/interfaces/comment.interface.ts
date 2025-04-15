import { Issue } from "@api/issues/interfaces/issue.interface";
import { User } from "@api/users/interfaces/user.interface";
import { Types } from "mongoose";

export interface Comment {
  authorId: Types.ObjectId | User;
  issueId: Types.ObjectId | Issue;
  content: string;
}
