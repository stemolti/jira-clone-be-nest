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

  @Prop({ type: String, ref: Project.name, required: true })
  projectId: string;

  @Prop({ type: String, ref: Release.name, required: true })
  releaseId: string;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: Sprint.name, required: true })
  activeSprintId?: Types.ObjectId;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);