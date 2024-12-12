import { MongoConnectionModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JWTModuleGlobal } from '@app/common';
import { OfferModule } from './modules/offer/offer.module';
import { GiftCardModule } from './modules/gift-card/gift-card.module';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/seller-service/.env`,
    }),
    NestScheduleModule.forRoot(),
    JWTModuleGlobal,
    MongoConnectionModule.register('SELLER'),
    OfferModule,
    GiftCardModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class SellerServiceModule {}
