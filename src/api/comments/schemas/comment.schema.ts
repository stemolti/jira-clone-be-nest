import { Issue } from "@api/issues/schemas/issue.schema";
import { User } from "@api/users/schemas/user.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";


export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {

  @Prop({ type: Types.ObjectId, ref: User.name, required: true})
  authorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Issue.name, required: true})
  issueId: Types.ObjectId;

  @Prop()
  content: string;

}

export const CommentSchema = SchemaFactory.createForClass(Comment);