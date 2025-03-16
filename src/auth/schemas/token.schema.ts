import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import { HydratedDocument, Types } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true, collection: 'tokens' })
export class Token {
  @Prop({ type: Types.ObjectId, required: true, ref: 'users', index: true })
  public userId: Types.ObjectId;

  @Prop({ default: true })
  public isActive: boolean;

  @Prop({ default: () => dayjs().add(1, 'year').toDate() })
  public expiredAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
