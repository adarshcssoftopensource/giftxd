import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserProfile {
  @Prop()
  avatar: string;

  @Prop()
  username: string;

  @Prop()
  last_seen: string;

  @Prop()
  last_ip: string;

  @Prop()
  facebook: string;

  @Prop()
  twitter: string;

  @Prop()
  linkedin: string;

  @Prop()
  trades_completed: number;

  @Prop()
  active_offers: string[]; // Assuming this should be an array of strings

  @Prop()
  feedback: string[]; // Assuming this should be an array of strings

  @Prop()
  location: string;

  @Prop()
  language: string;

  @Prop()
  trade_patterns: number;

  @Prop()
  trades: number;

  @Prop()
  tradevolume_btc: number;

  @Prop()
  tradevolume_eth: number;

  @Prop()
  tradevolume_usdt: number;

  @Prop()
  tradevolume_usdc: number;

  @Prop()
  trustedby: string;

  @Prop()
  blockedby: string;

  @Prop()
  hasblocked: number;

  @Prop({ default: Date.now() })
  joindate: Date;

  @Prop()
  profilelink: string;

  @Prop()
  positive_feedback: number;

  @Prop()
  negative_feedback: number;

  @Prop()
  holdings: number;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
