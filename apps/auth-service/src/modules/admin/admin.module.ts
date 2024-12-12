import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { USER_MODELS } from '@app/schemas';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
      { name: USER_MODELS.Role.name, schema: USER_MODELS.RoleSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
