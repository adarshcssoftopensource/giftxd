import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class GifXdLogsService {
  constructor(
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly gifXdLogsClientService: ClientProxy,
  ) {}

  createGftXdLogs(model: any) {
    const response = this.gifXdLogsClientService.send(
      'giftXdLogs.create',
      model,
    );
    return response;
  }

  // GetAllGftXdLogs() {
  //   return this.gifXdLogsService.send('giftXdLogs.getAll');
  // }
}
