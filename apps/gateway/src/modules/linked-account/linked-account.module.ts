import { Module } from '@nestjs/common';
import { LinkedAccountController } from './linked-account.controller';
import { LinkedAccountService } from './linked-account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';
import { SellerAuthGuard } from '@app/common/guard/sellerAuth.guard';
import { AuthService } from 'apps/auth-service/src/auth-service';
import { AdminService } from '../admin/admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [LinkedAccountController],
  providers: [LinkedAccountService, SellerAuthGuard, AuthService, AdminService],
  exports: [AdminService, LinkedAccountService],
})
export class LinkedAccountModule {}
