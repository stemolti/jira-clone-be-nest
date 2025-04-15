import { Project } from "@api/projects/schemas/project.schema";
import { Release } from "@api/releases/schemas/release.schema";
import { Sprint } from "@api/sprints/schemas/sprint.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type IssueDocument = HydratedDocument<Issue>;

@Schema({ timestamps: true })
export class Issue {

  @Prop({ type: Types.ObjectId, ref: Project.name, required: true})
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Release.name, required: true})
  releaseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Issue.name, required: true})
  issueId: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: Sprint.name, required: true})
  activeSprintId?: Types.ObjectId;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);