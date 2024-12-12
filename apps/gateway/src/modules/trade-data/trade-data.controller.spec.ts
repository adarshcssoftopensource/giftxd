import { Test, TestingModule } from '@nestjs/testing';
import { TradeDataController } from './trade-data.controller';

describe('TradeDataController', () => {
  let controller: TradeDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeDataController],
    }).compile();

    controller = module.get<TradeDataController>(TradeDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
