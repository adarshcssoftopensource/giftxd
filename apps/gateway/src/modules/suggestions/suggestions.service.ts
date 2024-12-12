import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HOME_DTOS } from '@app/dto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class SuggestionCardsService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createSuggestionCard(model: HOME_DTOS.SuggestionCreateDto) {
    const token = this.request.headers['x-access-token'];
    return this.authClientService.send('suggestioncard.create', { ...model, token});
  }

  getSuggestionCards() {
    const token = this.request.headers['x-access-token'];
    return this.authClientService.send('suggestioncard.user.get', { token });
  }
}
