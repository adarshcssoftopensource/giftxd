import { Injectable } from '@nestjs/common';
import { TradeDataDto } from '@app/dto/tradechart/index';

@Injectable()
export class TradeDataService {
  private readonly tradeData: TradeDataDto[] = [
    { date: '2023-06-01', numberOfTrades: 980, transactionalValue: 720000 },
    { date: '2023-06-02', numberOfTrades: 1075, transactionalValue: 810000 },
    { date: '2023-06-03', numberOfTrades: 1250, transactionalValue: 850000 },
    { date: '2023-06-04', numberOfTrades: 1300, transactionalValue: 900000 },
    { date: '2023-06-05', numberOfTrades: 1150, transactionalValue: 770000 },
    { date: '2023-06-06', numberOfTrades: 1200, transactionalValue: 740000 },
    { date: '2023-06-07', numberOfTrades: 1100, transactionalValue: 760000 },
    { date: '2023-06-08', numberOfTrades: 950, transactionalValue: 725000 },
    { date: '2023-06-09', numberOfTrades: 1050, transactionalValue: 785000 },
    { date: '2023-06-10', numberOfTrades: 1000, transactionalValue: 830000 },
  ];

  getTradeData(): TradeDataDto[] {
    return this.tradeData;
  }
}
