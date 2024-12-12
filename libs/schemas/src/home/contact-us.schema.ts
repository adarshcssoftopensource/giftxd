import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ContactUsMessage extends Document{
    @Prop()
    topic: string;
  
    @Prop()
    firstname: string;
  
    @Prop()
    lastname: string;
  
    @Prop()
    email_address: string;
  
    @Prop()
    message: string;

    @Prop({ default: Date.now() })
    created_at: Date;
}

export const ContactUsMessageSchema = SchemaFactory.createForClass(ContactUsMessage);
