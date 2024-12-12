import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../users';
import { SellerOffer } from '../seller/sellerOffer.schema';
import mongoose from 'mongoose';
@Schema()
export class UserCard {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  sellerOffer: SellerOffer;

  @Prop()
  front_side_image: string;

  @Prop()
  back_side_image: string;

  @Prop()
  card_number: string;

  @Prop()
  reciept_front_side: string;

  @Prop()
  reciept_back_side: string;

  @Prop({ required: false })
  card_exp_month: string;

  @Prop({ required: false })
  card_cvc: string;

  @Prop({ required: false })
  card_exp_year: string;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const UserCardSchema = SchemaFactory.createForClass(UserCard);
