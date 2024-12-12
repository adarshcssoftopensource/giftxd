import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { AdminService } from '../admin/admin.service';
import { USER_MODELS } from '@app/schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerAuthGuard } from '@app/common/guard/sellerAuth.guard';
import { AuthService } from 'apps/auth-service/src/auth-service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [SellerController],
  providers: [AdminService, SellerService, SellerAuthGuard, AuthService],
  exports: [AdminService, SellerService],
})
export class SellerModule {}
