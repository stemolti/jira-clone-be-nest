import { Issue } from "@api/issues/schemas/issue.schema";
import { User } from "@api/users/schemas/user.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";


export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {

  @Prop({ type: Types.ObjectId, required: true})
  commentId: Types.ObjectId | Comment | string;

  @Prop({ type: String, ref: User.name, required: true})
  authorId: string;

  @Prop({ type: String, ref: Issue.name, required: true})
  issueId: string;

  @Prop()
  content: string;

}

export const CommentSchema = SchemaFactory.createForClass(Comment);