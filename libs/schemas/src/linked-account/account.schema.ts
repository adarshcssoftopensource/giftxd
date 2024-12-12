import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../users';
import mongoose from 'mongoose';

export enum Website {
  Amazon = 'AMAZON',
  Steam = 'STEAM',
  Apple = 'APPLE',
  GooglePlay = 'GOOGLE_PLAY',
  iTunes = 'I_TUNES',
  RazerGold = 'RAZER_GOLD',
}

@Schema()
export class Proxies {
  @Prop({ type: String })
  country?: string;

  @Prop({ type: String })
  state?: string;

  @Prop({ type: String })
  city?: string;

  @Prop({ type: String })
  ISP?: string;

  @Prop({ type: String })
  zipCode?: string;
}

@Schema()
export class LinkedAccount {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  vendor: User;

  @Prop({ type: String, enum: Website })
  website: Website;

  @Prop({ required: false })
  externalId: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  twoFA: string;

  @Prop()
  currency: string;

  @Prop({ type: Proxies })
  proxies?: Proxies;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
  @Prop()
  emailIv: string;
  @Prop()
  passwordIv: string;

  @Prop({ default: 500 })
  giftXD_limit: number;

  @Prop({ default: 0 })
  consumption: number;
}

export const LinkedAccountSchema = SchemaFactory.createForClass(LinkedAccount);
