import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class PhoneNumber extends Document {
  @Prop({ unique: true })
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.Mixed }) 
  lookup: any;

  @Prop({ default: false })
  isRegistered: boolean;

  @Prop({ default: false })
  isVerified: boolean; 

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PhoneNumberSchema = SchemaFactory.createForClass(PhoneNumber);
