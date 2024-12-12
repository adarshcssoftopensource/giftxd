import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose from 'mongoose';

@Schema()
export class Vendor {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  country: string;

  @Prop()
  ResidencyProof: string;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
