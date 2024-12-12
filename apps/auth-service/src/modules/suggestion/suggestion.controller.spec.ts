import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionCardController } from './suggestion.controller';

describe('SuggestionController', () => {
  let controller: SuggestionCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuggestionCardController],
    }).compile();

    controller = module.get<SuggestionCardController>(SuggestionCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
