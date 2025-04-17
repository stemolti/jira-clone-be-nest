import { Types } from "mongoose";

export interface IComment {
  commentId: Types.ObjectId | IComment | string;
  authorId: string;
  issueId: string;
  content: string;
}
