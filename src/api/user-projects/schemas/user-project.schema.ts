import { Project } from "@api/projects/schemas/project.schema";
import { User } from "@api/users/schemas/user.schema";
import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema({ timestamps: true })
export class UserProject {
  @Prop({ type: String, ref: User.name, required: true})
  userId: string;

  @Prop({ type: String, ref: Project.name, required: true})
  projectId: string;
}