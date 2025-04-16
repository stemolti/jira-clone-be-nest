import { Project } from "@api/projects/schemas/project.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true })
export class Board {

  @Prop({ type: String, required: true})
  boardId: string;

  // For now projectId is not required, but optional
  @Prop({ type: String, ref: Project.name})
  projectId?: string;

  @Prop()
  name: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);