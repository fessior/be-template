import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  googleId: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  avatarUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
