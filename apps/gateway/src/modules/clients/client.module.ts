import { TCPConnectionModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { AdminService } from '../admin/admin.service';
import { AuthService } from 'apps/auth-service/src/auth-service';
import { USER_MODELS } from '@app/schemas';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  providers: [ClientService, AuthService, AdminService],
  controllers: [ClientController],
  exports: [AdminService],
})
export class ClientModule {}
