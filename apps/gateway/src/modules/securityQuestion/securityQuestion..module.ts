import { Module } from '@nestjs/common';
import { SecurityQuestionService } from './securityQuestion..service';
import { SecurityQuestionController } from './securityQuestion..controller';
import { SellerAuthGuard } from '@app/common/guard/sellerAuth.guard';
import { AuthService } from 'apps/auth-service/src/auth-service';
import { AdminService } from '../admin/admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [SecurityQuestionController],
  providers: [
    SecurityQuestionService,
    SellerAuthGuard,
    AuthService,
    AdminService,
  ],
  exports: [AdminService, SecurityQuestionService],
})
export class SecurityQuestionModule {}
