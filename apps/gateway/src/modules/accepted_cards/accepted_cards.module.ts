import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcceptedCardService } from './accepted_cards.service';
import { AcceptedCardsController } from './accepted_cards.controller';
import { AcceptedCard, AcceptedCardSchema } from '@app/schemas/home/accepted_cards.schema';
import { AuthService } from 'apps/auth-service/src/auth-service';
import { AdminService } from '../admin/admin.service';
import { JwtAuthGuard } from '@app/common/guard/auth.guard';
import { USER_MODELS } from '@app/schemas';
import { S3Service } from '@app/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AcceptedCard.name, schema: AcceptedCardSchema },
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [AcceptedCardsController],
  providers: [AcceptedCardService, S3Service, AuthService, AdminService, JwtAuthGuard],
})
export class AcceptedCardModule { }
