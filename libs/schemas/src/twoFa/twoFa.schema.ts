import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../users';

@Schema()
export class TwoFa {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop({ default: false })
  offerTwoFa: boolean;

  @Prop({ default: false })
  orderTwoFa: boolean;
}

export const TwoFaSchema = SchemaFactory.createForClass(TwoFa);
