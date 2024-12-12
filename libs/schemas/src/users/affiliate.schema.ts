import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Affiliate {
  @Prop()
  user_name: string;

  @Prop()
  full_name: string;

  @Prop()
  email: string;

  @Prop()
  company_name: string;

  @Prop()
  total_payouts: string;

  @Prop()
  date_onboarded: Date;

  @Prop()
  payment_method: string;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate);
