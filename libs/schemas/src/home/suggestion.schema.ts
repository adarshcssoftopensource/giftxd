import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SuggestionCard {
  @Prop()
  message: string;

  @Prop()
  username: string;

  @Prop({ default: Date.now() })
  created_date: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const SuggestionCardSchema =
  SchemaFactory.createForClass(SuggestionCard);
