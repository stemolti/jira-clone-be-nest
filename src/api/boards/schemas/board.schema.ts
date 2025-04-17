import { Project } from "@api/projects/schemas/project.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type BoardDocument = HydratedDocument<Board>;

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
export class Board {

  @Prop({ type: Number, required: true })
  boardId: number;

  @Prop({ type: String, ref: Project.name })
  projectId: string;

  @Prop()
  name: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);