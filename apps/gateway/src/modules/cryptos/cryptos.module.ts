import { Module } from '@nestjs/common';
import { CryptoController } from './cryptos.controller';
import { CryptoService } from './cryptos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HOME_MODELS } from '@app/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HOME_MODELS.Crypto.name, schema: HOME_MODELS.CryptoSchema },
    ]),
  ],
  providers: [CryptoService],
  controllers: [CryptoController],
})
export class CryptosModule {}
