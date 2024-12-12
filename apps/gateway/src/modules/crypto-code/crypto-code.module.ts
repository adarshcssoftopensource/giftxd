import { Module } from '@nestjs/common';
import { CryptoCodeService } from './crypto-code.service';
import { CryptoCodesController } from './crypto-code.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CRYPTO_CODES_MODELS, USER_MODELS } from '@app/schemas';
import { AdminService } from '../admin/admin.service';
import { SellerAuthGuard } from '@app/common/guard/sellerAuth.guard';
import { AuthService } from 'apps/auth-service/src/auth-service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_MODELS.User.name,
        schema: USER_MODELS.UserSchema,
      },
      {
        name: CRYPTO_CODES_MODELS.cryptoCode.name,
        schema: CRYPTO_CODES_MODELS.cryptoCodeSchema,
      },
    ]),
  ],
  controllers: [CryptoCodesController],
  providers: [AdminService, CryptoCodeService, SellerAuthGuard, AuthService],
  exports: [AdminService, CryptoCodeService],
})
export class CryptoCodeModule {}
