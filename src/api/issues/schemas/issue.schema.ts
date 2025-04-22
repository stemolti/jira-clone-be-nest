import { Project } from "@api/projects/schemas/project.schema";
import { Release } from "@api/releases/schemas/release.schema";
import { Sprint } from "@api/sprints/schemas/sprint.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type IssueDocument = HydratedDocument<Issue>;

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
export class Issue {

  @Prop({ type: Types.ObjectId, required: true })
  issueId: Types.ObjectId | Issue | string;

  // For now projectId is not required, but optional
  @Prop({ type: String, ref: Project.name })
  projectId: string;

  @Prop()
  summary: string;

  @Prop()
  description: string;

  @Prop({ type: String, ref: Sprint.name })
  sprintId?: string;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);