import { JwtAuthGuard } from '@app/common/guard/auth.guard';
import { USER_MODELS } from '@app/schemas';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'apps/auth-service/src/auth-service';
import { AdminService } from '../admin/admin.service';
import { UserCardController } from './user-card.controller';
import { UserCardService } from './user-card.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [UserCardController],
  providers: [UserCardService, AdminService, JwtAuthGuard, AuthService],
  exports: [AdminService],
})
export class UserCardModule {}
