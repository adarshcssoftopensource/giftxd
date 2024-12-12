import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ContactCard {
  @Prop()
  email_support: string;

  @Prop()
  phone_support: number;

  @Prop({ default: Date.now() })
  created_date: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const ContactCardSchema = SchemaFactory.createForClass(ContactCard);
