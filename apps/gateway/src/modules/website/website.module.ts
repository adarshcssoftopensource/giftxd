import { Module } from '@nestjs/common';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../../../../auth-service/src/auth-service';
import { USER_MODELS } from '@app/schemas';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { JwtAuthGuard } from '@app/common/guard/auth.guard';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
      { name: USER_MODELS.Client.name, schema: USER_MODELS.ClientSchema },
    ]),

    JwtModule.register({
      secret: 'yourSecretKey', // Replace with your actual secret key
      signOptions: { expiresIn: '1h' }, // Adjust the expiration as needed
    }),
  ],

  controllers: [WebsiteController],
  providers: [WebsiteService, AuthService, AdminService, JwtAuthGuard],
  exports: [AdminService],
})
export class WebsiteModule {}
