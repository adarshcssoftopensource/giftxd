import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { SellerAuthGuard } from '@app/common/guard/sellerAuth.guard';
import { AuthService } from 'apps/auth-service/src/auth-service';
import { AdminService } from '../admin/admin.service';
import { USER_MODELS } from '@app/schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [OfferController],
  providers: [OfferService, SellerAuthGuard, AuthService, AdminService],
  exports: [AdminService, OfferService],
})
export class OfferModule {}
