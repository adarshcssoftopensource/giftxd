import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyCodesController } from './currency-codes.controller';

describe('CurrencyCodesController', () => {
  let controller: CurrencyCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyCodesController],
    }).compile();

    controller = module.get<CurrencyCodesController>(CurrencyCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
