import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// export enum providerType {
//   Amazon = 'AMAZON',
//   Steam = 'STEAM ',
//   Apple='APPLE',
//   GooglePlay='GOOGLE_PLAY',
//   Tunes='I_TUNES',
//   RazerGold='RAZER_GOLD'
// }

@Schema()
export class Provider {
  @Prop({ type: String })
  name: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: String })
  value: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
