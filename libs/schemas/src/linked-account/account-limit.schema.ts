import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../users';
import mongoose from 'mongoose';

@Schema()
export class AccountLimit {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  vendor: User;

  @Prop({ type: Number, default: 5 })
  AMAZON?: number;
  @Prop({ type: Number, default: 5 })
  STEAM?: number;

  @Prop({ type: Number, default: 5 })
  APPLE?: number;

  @Prop({ type: Number, default: 5 })
  GOOGLE_PLAY?: number;

  @Prop({ type: Number, default: 5 })
  I_TUNES?: number;

  @Prop({ type: Number, default: 5 })
  RAZER_GOLD?: number;
}

export const LinkedAccountSchema = SchemaFactory.createForClass(AccountLimit);
