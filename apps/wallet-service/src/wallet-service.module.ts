import { Module } from '@nestjs/common';
import { WalletServiceController } from './wallet-service.controller';
import { WalletServiceService } from './wallet-service.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';
import { MongoConnectionModule } from '@app/common';

@Module({
  imports: [
    MongoConnectionModule.register('USER'),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/wallet-service/.env`,
    }),
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [WalletServiceController],
  providers: [WalletServiceService],
})
export class WalletServiceModule {}
