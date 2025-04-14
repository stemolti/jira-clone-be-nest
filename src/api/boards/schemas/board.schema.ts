import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BoardDocument = HydratedDocument<Board>;

@Schema({ timestamps: true })
export class Board {

  @Prop()
  projectId: string;

  @Prop()
  name: string;

  @Prop()
  description?: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);