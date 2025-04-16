import { User } from '@api/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {

  @Prop({ type: String, ref: Project.name, required: true})
  projectId: string;

  // For now userId is not required, but optional
  // because we want to allow creating projects without a user
  // This will be changed in the future
  @Prop({ type: Types.ObjectId, ref: User.name})
  userId?: Types.ObjectId | User | string; 

  @Prop()
  name: string;

  @Prop()
  description?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
