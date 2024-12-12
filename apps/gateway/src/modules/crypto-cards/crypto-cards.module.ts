import { Module } from '@nestjs/common';
import { CryptoCardsController } from './crypto-cards.controller';
import { CryptoCardsService } from './crypto-cards.service';

@Module({
  controllers: [CryptoCardsController],
  providers: [CryptoCardsService],
})
export class CryptoCardsModule {}
