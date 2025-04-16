import { HydratedDocument, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Sprint } from "@api/sprints/schemas/sprint.schema";
import { Issue } from "@api/issues/schemas/issue.schema";


export type IssueSprintDocument = HydratedDocument<IssueSprint>;

@Schema({
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      ret.v = ret.__v;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  }, timestamps: true
})
export class IssueSprint {
  @Prop({ type: String, ref: Sprint.name, required: true })
  sprintId: string;

  @Prop({ type: String, ref: Issue.name, required: true })
  issueId: string;
}

export const IssueSprintSchema = SchemaFactory.createForClass(IssueSprint)