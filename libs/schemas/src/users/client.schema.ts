import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export enum KycVerificationStatus {
  NOT_STARTED = 'not_started',
  PENDING = 'pending',
  COMPLETED = 'completed',
}
@Schema()
export class Client {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop({ default: true })
  is_activated: boolean;

  @Prop({ default: 0 })
  limit: number;

  @Prop({ default: 0 })
  consumption: number;

  @Prop({ default: false })
  isUnlimited: boolean;

  @Prop({ required: false })
  completed: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ default: false })
  twofa_enabled: boolean;

  @Prop({ default: '' })
  twofa_secret: string;

  @Prop()
  signup_date: Date;

  @Prop({ default: KycVerificationStatus.NOT_STARTED })
  identity_verif_status: KycVerificationStatus;

  @Prop({ default: KycVerificationStatus.NOT_STARTED })
  residency_verif_status: KycVerificationStatus;

  @Prop({ default: Date.now() })
  updated_at: Date;

  @Prop({ default: Date.now() })
  created_at: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
