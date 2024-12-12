import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ORDER_MODELS,
  TRANSACTION_MODELS,
  OFFER_MODELS,
  SELLER_MODEL,
  ORDER_TRANSACTION_MODEL,
  USER_MODELS,
  PROVIDER_MODEL,
  LINKED_ACCOUNT_MODEL,
  ORDER_HISTORY_MODELS,
  GIFT_XD_LOGS_MODELS,
  HOME_MODELS,
  TWO_FA_SETTINGS_MODEL,
} from '@app/schemas';
import { TCPConnectionModule } from '@app/common';
import { GiftXdLogsService } from '../gifXd-logs/gifXd-logs.service';
import { CryptoService } from 'apps/gateway/src/modules/cryptos/cryptos.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ORDER_TRANSACTION_MODEL.OrderTransaction.name,
        schema: ORDER_TRANSACTION_MODEL.OrderTransactionSchema,
      },
      {
        name: GIFT_XD_LOGS_MODELS.GiftXdLogs.name,
        schema: GIFT_XD_LOGS_MODELS.GiftXdLogsSchema,
      },
      {
        name: HOME_MODELS.Crypto.name,
        schema: HOME_MODELS.CryptoSchema,
      },
      {
        name: ORDER_HISTORY_MODELS.OrderHistory.name,
        schema: ORDER_HISTORY_MODELS.OrderHistorySchema,
      },
      { name: OFFER_MODELS.Offer.name, schema: OFFER_MODELS.OfferSchema },
      {
        name: LINKED_ACCOUNT_MODEL.LinkedAccount.name,
        schema: LINKED_ACCOUNT_MODEL.LinkedAccountSchema,
      },
      {
        name: SELLER_MODEL.SellerOffer.name,
        schema: SELLER_MODEL.SellerOfferSchema,
      },
      { name: ORDER_MODELS.Order.name, schema: ORDER_MODELS.OrderSchema },
      { name: ORDER_MODELS.UserCard.name, schema: ORDER_MODELS.UserCardSchema },
      {
        name: TRANSACTION_MODELS.Transaction.name,
        schema: TRANSACTION_MODELS.TransactionSchema,
      },
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
      { name: USER_MODELS.Role.name, schema: USER_MODELS.RoleSchema },

      {
        name: PROVIDER_MODEL.Provider.name,
        schema: PROVIDER_MODEL.ProviderSchema,
      },

      {
        name: TWO_FA_SETTINGS_MODEL.TwoFa.name,
        schema: TWO_FA_SETTINGS_MODEL.TwoFaSchema,
      },
    ]),
    TCPConnectionModule.register('ORDER_CLIENT_SERVICE', {
      portKey: 'ORDER_CLIENT_SERVICE_PORT',
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, GiftXdLogsService, CryptoService],
})
export class OrderModule {}
