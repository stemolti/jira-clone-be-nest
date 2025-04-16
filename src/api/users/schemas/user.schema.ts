import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

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
export class User {

  @Prop({ type: Types.ObjectId, required: true })
  userId?: Types.ObjectId | User;

  @Prop()
  name: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
