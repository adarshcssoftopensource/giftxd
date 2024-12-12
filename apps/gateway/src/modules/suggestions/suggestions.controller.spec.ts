import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionCardsController } from './suggestions.controller';

describe('SuggestionsController', () => {
  let controller: SuggestionCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuggestionCardsController],
    }).compile();

    controller = module.get<SuggestionCardsController>(
      SuggestionCardsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
