import { HydratedDocument, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Sprint } from "@api/sprints/schemas/sprint.schema";
import { Issue } from "@api/issues/schemas/issue.schema";


export type IssueSprintDocument = HydratedDocument<IssueSprint>;

@Schema({ timestamps: true })
export class IssueSprint {
  @Prop({ type: Types.ObjectId, ref: Sprint.name, required: true})
  sprintId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Issue.name, required: true})
  issueId: Types.ObjectId;
}

export const IssueSprintSchema = SchemaFactory.createForClass(IssueSprint)