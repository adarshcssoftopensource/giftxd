import { Module } from '@nestjs/common';
import { coinMakerController } from './coin-maker.controller';
import { CoinMakerService } from './coin-maker.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HOME_MODELS } from '@app/schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HOME_MODELS.Crypto.name, schema: HOME_MODELS.CryptoSchema },
    ]),
  ],
  controllers: [coinMakerController],
  providers: [CoinMakerService],
})
export class coinMakerModule {}
