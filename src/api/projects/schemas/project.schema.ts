import { User } from '@api/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

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
export class Project {

  @Prop({ type: String, ref: Project.name, required: true })
  projectId: string;

  // For now userId is not required, but optional
  // because we want to allow creating projects without a user
  // This will be changed in the future
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId?: Types.ObjectId | User | string;

  @Prop()
  name: string;

  @Prop()
  description: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
