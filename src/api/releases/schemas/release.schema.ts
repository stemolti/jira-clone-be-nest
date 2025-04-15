import { Project } from "@api/projects/schemas/project.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";



export type ReleaseDocument = HydratedDocument<Release>;

@Schema({ timestamps: true })
export class Release {

  @Prop({ type: String, required: true })
  releaseId: string;

  @Prop({ type: String, ref: Project.name , required: true })
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
