import { Issue } from "@api/issues/interfaces/issue.interface";
import { User } from "@api/users/interfaces/user.interface";
import { Types } from "mongoose";

export interface Comment {
  commentId: Types.ObjectId | Comment | string;
  authorId: string;
  issueId: string;
  content: string;
}
