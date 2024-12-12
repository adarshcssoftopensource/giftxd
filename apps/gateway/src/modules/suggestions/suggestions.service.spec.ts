import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionCardsService } from './suggestions.service';

describe('SuggestionsService', () => {
  let service: SuggestionCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuggestionCardsService],
    }).compile();

    service = module.get<SuggestionCardsService>(SuggestionCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
