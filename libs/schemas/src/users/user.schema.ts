import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Role } from './role.schema';
import { SettingsCard } from '@app/schemas/home/settings.schema';

export class OTPData {
  otp: string;
  expiryTime: number; // Expiry time in milliseconds
}

@Schema()
export class User {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
  })
  role: Role;

  @Prop()
  token: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  phone_number: string;

  @Prop({ default: '' })
  country: string;

  @Prop({ default: '' })
  country_code: string;

  @Prop({ default: '' })
  ip: string;

  @Prop({ default: false })
  email_verified: boolean;

  @Prop({ default: 0 })
  login_count: number;

  @Prop({ type: OTPData })
  email_otp: OTPData;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SettingsCard',
  })
  settings: SettingsCard | Types.ObjectId;

  @Prop({ default: false })
  twofaEnabled: boolean;

  @Prop({ required: false })
  twofaSecret: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
