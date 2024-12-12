import { Module } from '@nestjs/common';
import { VendorController } from './vendor.cotroller';
import { VendorService } from './vendor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';
import { AdminService } from '../admin/admin.service';
import { SellerAuthGuard } from '@app/common/guard/sellerAuth.guard';
import { AuthService } from 'apps/auth-service/src/auth-service';

@Module({
  controllers: [VendorController],
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  providers: [AdminService, VendorService, SellerAuthGuard, AuthService],
  exports: [AdminService, VendorService],
})
export class VendorModule {}
