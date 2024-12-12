import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class Activity {
  @Prop({ required: true })
  employeesInvolved: ObjectId[];

  @Prop({ required: true })
  activityType: string;

  @Prop({ required: true })
  numberOfActions: number;

  @Prop({ default: Date.now })
  dateCreated: Date;

  @Prop({ default: Date.now })
  lastResponse: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
