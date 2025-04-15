import { Board } from "@api/boards/interfaces/board.interface";
import { Issue } from "@api/issues/interfaces/issue.interface";
import { Types } from "mongoose";

export interface UserProject {
  boardId: Types.ObjectId | Board;
  issueId: Types.ObjectId | Issue;
}