import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TCPConnectionModule } from '@app/common';
import {
  ATTRIBUTE_MODEL,
  OFFER_MODELS,
  PROVIDER_MODEL,
  SELLER_MODEL,
  LINKED_ACCOUNT_MODEL,
  USER_MODELS,
  ORDER_MODELS,
  ORDER_TRANSACTION_MODEL,
  HOME_MODELS,
  ORDER_HISTORY_MODELS,
  GIFT_XD_LOGS_MODELS,
  TWO_FA_SETTINGS_MODEL,
} from '@app/schemas';
import { CryptoService } from 'apps/gateway/src/modules/cryptos/cryptos.service';
import { GiftXdLogsService } from '../gifXd-logs/gifXd-logs.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OFFER_MODELS.Offer.name, schema: OFFER_MODELS.OfferSchema },
      {
        name: SELLER_MODEL.SellerOffer.name,
        schema: SELLER_MODEL.SellerOfferSchema,
      },
      {
        name: ORDER_MODELS.Order.name,
        schema: ORDER_MODELS.OrderSchema,
      },
      {
        name: GIFT_XD_LOGS_MODELS.GiftXdLogs.name,
        schema: GIFT_XD_LOGS_MODELS.GiftXdLogsSchema,
      },
      {
        name: ORDER_HISTORY_MODELS.OrderHistory.name,
        schema: ORDER_HISTORY_MODELS.OrderHistorySchema,
      },
      {
        name: HOME_MODELS.Crypto.name,
        schema: HOME_MODELS.CryptoSchema,
      },
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
      { name: USER_MODELS.Role.name, schema: USER_MODELS.RoleSchema },
      {
        name: LINKED_ACCOUNT_MODEL.LinkedAccount.name,
        schema: LINKED_ACCOUNT_MODEL.LinkedAccountSchema,
      },
      {
        name: ATTRIBUTE_MODEL.Attribute.name,
        schema: ATTRIBUTE_MODEL.AttributeSchema,
      },
      {
        name: PROVIDER_MODEL.Provider.name,
        schema: PROVIDER_MODEL.ProviderSchema,
      },
      {
        name: ORDER_TRANSACTION_MODEL.OrderTransaction.name,
        schema: ORDER_TRANSACTION_MODEL.OrderTransactionSchema,
      },
      {
        name: HOME_MODELS.Crypto.name,
        schema: HOME_MODELS.CryptoSchema,
      },
      { name: USER_MODELS.Client.name, schema: USER_MODELS.ClientSchema },
      {
        name: HOME_MODELS.PhoneNumber.name,
        schema: HOME_MODELS.PhoneNumberSchema,
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
  controllers: [OfferController],
  providers: [OfferService, CryptoService, GiftXdLogsService],
})
export class OfferModule {}
