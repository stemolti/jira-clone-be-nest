import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type SprintDpocument = HydratedDocument<Sprint>;

@Schema({ timestamps: true })
export class Sprint {
  @Prop()
  name: string;

  @Prop()
  state: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  goal: string;
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);