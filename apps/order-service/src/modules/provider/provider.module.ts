import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PROVIDER_DETAILS_MODELS,
  PROVIDER_MODEL,
  USER_MODELS,
} from '@app/schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PROVIDER_MODEL.Provider.name,
        schema: PROVIDER_MODEL.ProviderSchema,
      },
      {
        name: USER_MODELS.User.name,
        schema: USER_MODELS.UserSchema,
      },
      {
        name: PROVIDER_DETAILS_MODELS.ProviderDetails.name,
        schema: PROVIDER_DETAILS_MODELS.ProviderDetailsSchema,
      },
    ]),
  ],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
