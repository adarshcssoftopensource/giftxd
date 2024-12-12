// settings-card.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SettingsCard {
  @Prop()
  username: string;
  @Prop({ default: () => Date.now() })
  username_last_updated: Date;

  @Prop()
  email: string;
  @Prop({ default: () => Date.now() })
  email_last_updated: Date;

  @Prop()
  phone_number: number;
  @Prop({ default: () => Date.now() })
  phone_number_last_updated: Date;

  @Prop()
  password: string;
  @Prop({ default: () => Date.now() })
  password_last_updated: Date;

  @Prop()
  notification_preferences: string;
  @Prop({ default: () => Date.now() })
  notification_preferences_last_updated: Date;

  @Prop()
  active_session: string;

  @Prop()
  last_active: string;

  @Prop({ default: false })
  account_closed: Boolean;

  @Prop()
  preferred_language: string;
  @Prop({ default: () => Date.now() })
  preferred_language_last_updated: Date;

  @Prop()
  preferred_time_zone: string;
  @Prop({ default: () => Date.now() })
  preferred_time_zone_last_updated: Date;

  @Prop({ default: () => Date.now() })
  created_at: Date;

  @Prop({ default: () => Date.now() })
  updated_at: Date;
}

export const SettingsCardSchema = SchemaFactory.createForClass(SettingsCard);
