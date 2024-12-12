import { Module } from '@nestjs/common';
import { TradeDataService } from './trade-data.service';
import { TradeDataController } from './trade-data.controller';

@Module({
  providers: [TradeDataService],
  controllers: [TradeDataController],
})
export class TradeDataModule {}
