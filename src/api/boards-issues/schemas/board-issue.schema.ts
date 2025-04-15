import { Board } from "@api/boards/schemas/board.schema";
import { Issue } from "@api/issues/schemas/issue.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"

export type BoardIssueDocument = HydratedDocument<BoardIssue>;

@Schema({ timestamps: true })
export class BoardIssue {
  @Prop({ type: String, ref: Board.name, required: true})
  boardId: string

  @Prop({ type: String, ref: Issue.name, required: true})
  issueId: string
}

export const BoardIssueSchema = SchemaFactory.createForClass(BoardIssue)