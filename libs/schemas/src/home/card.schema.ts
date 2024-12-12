import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class DetectionAccuracyRate {
  @Prop()
  cardNumber: number;

  @Prop()
  expirationDate: number;

  @Prop()
  securityCode: number;
}

@Schema()
export class Card extends Document {
  @Prop()
  cardNumber: string;

  @Prop()
  validThruMonth: string;

  @Prop()
  validThruYear: string;

  @Prop()
  cvv: string;

  @Prop()
  provider: string;

  @Prop()
  parsedText: string;

  @Prop({ type: DetectionAccuracyRate })
  detectionAccuracyRate: DetectionAccuracyRate;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CardSchema = SchemaFactory.createForClass(Card);
