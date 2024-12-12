import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class ProviderDetails {
  @Prop()
  provider: mongoose.Schema.Types.Mixed;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const ProviderDetailsSchema =
  SchemaFactory.createForClass(ProviderDetails);
