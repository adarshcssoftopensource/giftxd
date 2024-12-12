import { MessagePattern } from '@nestjs/microservices';
import { SuggestionCardService } from './suggestion.service';
import { Controller } from '@nestjs/common';
import { HOME_DTOS } from '@app/dto';

@Controller('suggestioncards')
export class SuggestionCardController {
  constructor(private suggestioncardService: SuggestionCardService) {}

  @MessagePattern('suggestioncard.create')
  createSuggestionCard(model: { message: string, token: string }) {
    const data = this.suggestioncardService.createSuggestionCard(model);
    return data;
  }
  @MessagePattern('suggestioncard.user.get')
  getSuggestionCards(model: { token: string }) {
    return this.suggestioncardService.getSuggestionCards(model);
  }
}
