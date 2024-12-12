import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionCardService } from './suggestion.service';

describe('SuggestionService', () => {
  let service: SuggestionCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuggestionCardService],
    }).compile();

    service = module.get<SuggestionCardService>(SuggestionCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
