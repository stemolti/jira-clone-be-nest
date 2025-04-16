import { Project } from "@api/projects/schemas/project.schema";
import { User } from "@api/users/schemas/user.schema";
import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";


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
export class UserProject {
  @Prop({ type: String, ref: User.name, required: true })
  userId: string;

  @Prop({ type: String, ref: Project.name, required: true })
  projectId: string;
}