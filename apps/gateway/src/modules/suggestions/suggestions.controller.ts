import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuards,
  MessageResponseInterceptor,
  ResponseInterceptor,
  ResponseMessage,
} from '@app/common';
import { SuggestionCardsService } from './suggestions.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { HOME_DTOS } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('suggestioncard')
@ApiTags('suggestioncard')
export class SuggestionCardsController {
  constructor(private suggestioncardService: SuggestionCardsService) {}

  @Post('/create')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('suggestioncard created')
  @UseInterceptors(ResponseInterceptor)
  createSuggestionCard(@Body() model: HOME_DTOS.SuggestionCreateDto) {
    return this.suggestioncardService.createSuggestionCard(model);
  }

  @Get('/get')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  async getUserCount() {
    return this.suggestioncardService.getSuggestionCards();
  }
}
