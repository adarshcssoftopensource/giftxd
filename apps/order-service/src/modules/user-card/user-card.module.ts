import { Module } from '@nestjs/common';
import { UserCardController } from './user-card.controller';
import { UserCardService } from './user-card.service';
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
  controllers: [UserCardController],
  providers: [UserCardService, S3Service],
})
export class UserCardModule {}
