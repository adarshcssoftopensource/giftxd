// src/crypto-card/crypto-card.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CryptoCard {
  @Prop()
  name: string;

  @Prop()
  icon: string;

  @Prop()
  code: string;
}

export const CryptoCardSchema = SchemaFactory.createForClass(CryptoCard);
