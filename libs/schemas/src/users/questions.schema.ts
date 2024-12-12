// src/crypto-card/crypto-card.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Question {
  @Prop()
  question: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
