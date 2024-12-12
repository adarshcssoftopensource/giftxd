import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';
import { CryptoCardController } from './crypto-card.controller';
import { CryptoCardService } from './crypto-card.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_MODELS.CryptoCard.name,
        schema: USER_MODELS.CryptoCardSchema,
      },
    ]),
  ],
  controllers: [CryptoCardController],
  providers: [CryptoCardService],
})
export class CryptoCardModule {}
