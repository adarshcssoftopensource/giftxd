import { Module } from '@nestjs/common';
import { CurrencyCodesController } from './currency-code.controller';
import { CurrencyCodeService } from './currency-code.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CURRENCY_CODE_MODELS,
  PROVIDER_MODEL,
  USER_MODELS,
} from '@app/schemas';
import { AdminService } from '../admin/admin.service';
import { SellerAuthGuard } from '@app/common/guard/sellerAuth.guard';
import { AuthService } from 'apps/auth-service/src/auth-service';
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
        name: CURRENCY_CODE_MODELS.currencyCode.name,
        schema: CURRENCY_CODE_MODELS.currencyCodeSchema,
      },
    ]),
  ],
  controllers: [CurrencyCodesController],
  providers: [AdminService, CurrencyCodeService, SellerAuthGuard, AuthService],
  exports: [AdminService, CurrencyCodeService],
})
export class CurrencyModule {}
