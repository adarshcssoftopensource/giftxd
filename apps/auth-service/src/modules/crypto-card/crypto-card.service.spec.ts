import { Test, TestingModule } from '@nestjs/testing';
import { CryptoCardService } from './crypto-card.service';

describe('CryptoCardService', () => {
  let service: CryptoCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoCardService],
    }).compile();

    service = module.get<CryptoCardService>(CryptoCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
