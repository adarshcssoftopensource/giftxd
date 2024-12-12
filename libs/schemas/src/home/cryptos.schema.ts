import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Crypto {
  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const CryptoSchema = SchemaFactory.createForClass(Crypto);
export type CryptoDocument = Crypto & Document;