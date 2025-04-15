import { Project } from "@api/projects/schemas/project.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true })
export class Board {

  @Prop({ type: Types.ObjectId, ref: Project.name, required: true})
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Board.name, required: true})
  boardId: Types.ObjectId; 

  @Prop()
  name: string;

  @Prop()
  description?: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);