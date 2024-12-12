import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum SortOrderString{
  ASCENDING = "ascending",
  DESCENDING = "descending"
}

@Schema()
export class AcceptedCard extends Document {
  @Prop()
  name: string;

  @Prop()
  cardImage: string;
}

export const AcceptedCardSchema = SchemaFactory.createForClass(AcceptedCard);