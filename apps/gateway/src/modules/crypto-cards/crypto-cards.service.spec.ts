import { Test, TestingModule } from '@nestjs/testing';
import { CryptoCardsService } from './crypto-cards.service';

describe('CryptoCardsService', () => {
  let service: CryptoCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoCardsService],
    }).compile();

    service = module.get<CryptoCardsService>(CryptoCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
