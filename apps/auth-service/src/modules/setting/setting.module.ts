// settings.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HOME_MODELS } from '@app/schemas';
import { SettingsController } from './setting.controller';
import { SettingsService } from './setting.service';
import { USER_MODELS } from '@app/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HOME_MODELS.SettingsCard.name,
        schema: HOME_MODELS.SettingsCardSchema,
      },
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
