import { Module } from '@nestjs/common';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS, HOME_MODELS, TWO_FA_SETTINGS_MODEL } from '@app/schemas';
import { S3Service } from '@app/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
      { name: USER_MODELS.Client.name, schema: USER_MODELS.ClientSchema },
      { name: USER_MODELS.Role.name, schema: USER_MODELS.RoleSchema },
      {
        name: HOME_MODELS.PhoneNumber.name,
        schema: HOME_MODELS.PhoneNumberSchema,
      },
      {
        name: HOME_MODELS.SettingsCard.name,
        schema: HOME_MODELS.SettingsCardSchema,
      },
      {
        name: TWO_FA_SETTINGS_MODEL.TwoFa.name,
        schema: TWO_FA_SETTINGS_MODEL.TwoFaSchema,
      },
    ]),
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService, S3Service, ConfigService],
})
export class WebsiteModule {}
