import { Test, TestingModule } from '@nestjs/testing';
import { CryptoCardsController } from './crypto-cards.controller';

describe('CryptoCardsController', () => {
  let controller: CryptoCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoCardsController],
    }).compile();

    controller = module.get<CryptoCardsController>(CryptoCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
