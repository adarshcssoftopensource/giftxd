import { Controller, Get } from '@nestjs/common';
import { TradeDataService } from './trade-data.service';
import { TradeDataDto } from '@app/dto/tradechart/index';
import { ApiTags } from '@nestjs/swagger';

@Controller('trade-data')
@ApiTags('graph')
export class TradeDataController {
  constructor(private readonly tradeDataService: TradeDataService) {}

  @Get()
  getTradeData(): TradeDataDto[] {
    return this.tradeDataService.getTradeData();
  }
}
