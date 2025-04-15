import { User } from '@api/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {

  @Prop({ type: Types.ObjectId, ref: Project.name, required: true})
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true})
  userId?: Types.ObjectId; 

  @Prop()
  name: string;

  @Prop()
  description?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
