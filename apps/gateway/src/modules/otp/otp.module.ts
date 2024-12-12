import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { HOME_MODELS, USER_MODELS } from '@app/schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AdminService } from '../admin/admin.service';
import { AuthService } from 'apps/auth-service/src/auth-service';
import { SellerAuthGuard } from '@app/common/guard/sellerAuth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HOME_MODELS.PhoneNumber.name,
        schema: HOME_MODELS.PhoneNumberSchema,
      },
      {
        name: USER_MODELS.User.name,
        schema: USER_MODELS.UserSchema
      },
      {
        name: USER_MODELS.Client.name,
        schema: USER_MODELS.ClientSchema
      },
      { 
        name: USER_MODELS.Role.name, 
        schema: USER_MODELS.RoleSchema 
      },
    ]),
  ],
  controllers: [OtpController],
  providers: [OtpService, ConfigService, SellerAuthGuard, AuthService, AdminService],
})
export class OtpModule { }
