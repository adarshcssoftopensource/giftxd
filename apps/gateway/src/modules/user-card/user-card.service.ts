import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_DTOS } from '@app/dto';
import { REQUEST } from '@nestjs/core';
@Injectable()
export class UserCardService {
  constructor(
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly orderClientService: ClientProxy,
    @Inject(REQUEST)
    private request: Request,
  ) {}

  uploadCard(files: any, model: any) {
    model.token = this.request.headers['x-access-token'];
    return this.orderClientService.send('user_card.uploads', {
      ...files,
      ...model,
    });
  }

  getUserCards(query: ORDER_DTOS.GetUserCardDto) {
    query.token = this.request.headers['x-access-token'];
    return this.orderClientService.send('user_card.getByUser', { ...query });
  }
}
