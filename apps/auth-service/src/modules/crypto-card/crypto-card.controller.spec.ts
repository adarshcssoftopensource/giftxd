import { Test, TestingModule } from '@nestjs/testing';
import { CryptoCardController } from './crypto-card.controller';

describe('CryptoCardController', () => {
  let controller: CryptoCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoCardController],
    }).compile();

    controller = module.get<CryptoCardController>(CryptoCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
