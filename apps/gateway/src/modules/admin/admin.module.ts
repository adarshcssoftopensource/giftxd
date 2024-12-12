import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { USER_MODELS } from '@app/schemas';
import { JwtAuthGuard } from '../../../../../libs/common/src/guard/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../../../../auth-service/src/auth-service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard, AuthService],
  exports: [AdminService],
})
export class AdminModule {}
console.log();
