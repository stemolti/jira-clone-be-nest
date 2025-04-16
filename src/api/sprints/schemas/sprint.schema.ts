import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type SprintDocument = HydratedDocument<Sprint>;

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
export class Sprint {

  @Prop({ type: String, required: true })
  sprintId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop()
  state: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop()
  goal: string;
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);