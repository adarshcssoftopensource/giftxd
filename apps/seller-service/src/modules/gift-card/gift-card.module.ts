import { Module } from '@nestjs/common';
import { GiftCardController } from './gift-card.controller';
import { GiftCardService } from './gift-card.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ORDER_MODELS, SELLER_MODEL, USER_MODELS } from '@app/schemas';
import { S3Service } from '@app/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ORDER_MODELS.UserCard.name, schema: ORDER_MODELS.UserCardSchema },
      {
        name: SELLER_MODEL.SellerOffer.name,
        schema: SELLER_MODEL.SellerOfferSchema,
      },
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
      { name: USER_MODELS.Role.name, schema: USER_MODELS.RoleSchema },
    ]),
  ],
  controllers: [GiftCardController],
  providers: [GiftCardService, S3Service],
})
export class GiftCardModule {}
