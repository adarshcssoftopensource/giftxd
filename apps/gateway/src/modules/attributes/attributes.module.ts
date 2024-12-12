import { Module } from '@nestjs/common';
import { AttributesController } from './attributes.controller';
import { AttributeService } from './attributes.service';
import { SellerAuthGuard } from '@app/common/guard/sellerAuth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';
import { AuthService } from 'apps/auth-service/src/auth-service';
import { AdminService } from '../admin/admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [AttributesController],
  providers: [AttributeService, SellerAuthGuard, AuthService, AdminService],
  exports: [AdminService, AttributeService],
})
export class AttributesModule {}

