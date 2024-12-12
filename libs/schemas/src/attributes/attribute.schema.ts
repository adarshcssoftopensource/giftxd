import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Provider } from '../provider';

@Schema()
export class Attribute {
  @Prop({ type: String })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Provider.name,
  })
  provider: Provider;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Attribute.name,
  })
  parent_id: Attribute;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);
