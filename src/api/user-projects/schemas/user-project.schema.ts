import { User } from "@api/users/schemas/user.schema";
import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema({ timestamps: true })
export class UserProject {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true})
  userId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true})
  projectId: Types.ObjectId
}