import { Project } from "@api/projects/schemas/project.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true })
export class Board {

  @Prop({ type: String, required: true})
  boardId: string;

  @Prop({ type: String, ref: Project.name, required: true})
  projectId?: string;

  @Prop()
  name: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);