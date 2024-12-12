import { Module } from '@nestjs/common';
import { ProviderService } from './provideer.service';
import { ProviderController } from './provider.controllter';
import { AdminService } from '../admin/admin.service';
import { SellerAuthGuard } from '@app/common/guard/sellerAuth.guard';
import { AuthService } from 'apps/auth-service/src/auth-service';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [ProviderController],
  providers: [ProviderService, SellerAuthGuard, AuthService, AdminService],
  exports: [AdminService, ProviderService],
})
export class ProviderModule {}
