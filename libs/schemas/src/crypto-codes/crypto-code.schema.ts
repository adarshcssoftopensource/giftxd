import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class cryptoCode {
  @Prop()
  name: string;

  @Prop()
  value: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const cryptoCodeSchema = SchemaFactory.createForClass(cryptoCode);
