import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop()
  name: string;

  @Prop()
  description?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
