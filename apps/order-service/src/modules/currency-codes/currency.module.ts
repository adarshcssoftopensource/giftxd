import { Module } from '@nestjs/common';
import { CurrencyCodeService } from './currency-code.service';
import { CurrencyCodeController } from './currency.code.controller';
import { CURRENCY_CODE_MODELS, USER_MODELS } from '@app/schemas';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CURRENCY_CODE_MODELS.currencyCode.name,
        schema: CURRENCY_CODE_MODELS.currencyCodeSchema,
      },
      {
        name: USER_MODELS.User.name,
        schema: USER_MODELS.UserSchema,
      },
    ]),
  ],
  controllers: [CurrencyCodeController],
  providers: [CurrencyCodeService],
})
export class currencyCodeModule {}
