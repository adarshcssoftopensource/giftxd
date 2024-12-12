import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { USER_MODELS } from '@app/schemas';
import { JwtAuthGuard } from '../../../../../libs/common/src/guard/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../../../../auth-service/src/auth-service';
import { AdminService } from '../admin/admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [AdminService, OrderService, JwtAuthGuard, AuthService],
  exports: [AdminService, OrderService],
})
export class OrderModule {}
