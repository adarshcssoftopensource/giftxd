import { MongoConnectionModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JWTModuleGlobal } from '@app/common';
import { OrderModule } from './modules/order/order.module';
import { UserCardModule } from './modules/user-card/user-card.module';
import { OfferModule } from './modules/offer/offer.module ';

import { ProviderModule } from './modules/provider/provider.module';
import { AttributeModule } from './modules/attributes/attribute.module';
import { LinkedAccountModule } from './modules/linked-account/linked-account.module';
import { currencyCodeModule } from './modules/currency-codes/currency.module';
import { CryptoCodeModule } from './modules/crypto-codes/crypto.module';
import { GiftXdLogsModule } from './modules/gifXd-logs/gifXd-logs.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/order-service/.env`,
    }),
    JWTModuleGlobal,
    MongoConnectionModule.register('ORDER'),
    OrderModule,
    UserCardModule,
    ProviderModule,
    currencyCodeModule,
    AttributeModule,
    GiftXdLogsModule,
    CryptoCodeModule,
    OfferModule,
    LinkedAccountModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class OrderServiceModule {}
