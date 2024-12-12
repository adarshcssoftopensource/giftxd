import { Module } from '@nestjs/common';
import { CRYPTO_CODES_MODELS, USER_MODELS } from '@app/schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoCodeController } from './crypto.code.controller';
import { CryptoCodeService } from './crypto-code.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CRYPTO_CODES_MODELS.cryptoCode.name,
        schema: CRYPTO_CODES_MODELS.cryptoCodeSchema,
      },
      {
        name: USER_MODELS.User.name,
        schema: USER_MODELS.UserSchema,
      },
    ]),
  ],
  controllers: [CryptoCodeController],
  providers: [CryptoCodeService],
})
export class CryptoCodeModule {}
