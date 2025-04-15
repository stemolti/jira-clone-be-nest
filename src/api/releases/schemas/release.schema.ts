import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";



export type ReleaseDocument = HydratedDocument<Release>;

@Schema({ timestamps: true })
export class Release {

  @Prop()
  projectId: string;

  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop()        
  releaseDate: Date;

  @Prop()
  description?: string;

}

export const ReleaseSchema = SchemaFactory.createForClass(Release);
