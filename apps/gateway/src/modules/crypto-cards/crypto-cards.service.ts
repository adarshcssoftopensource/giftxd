import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';

@Injectable()
export class CryptoCardsService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
  ) {}

  // createCryptoCard(model: USER_DTOS.CryptoCreateDto, svgContent: string) {
  //   // Combine the DTO and SVG content into a single object for the microservice call
  //   const combinedData = { ...model, icon: svgContent };
  //   return this.authClientService.send('cryptocard.create', combinedData);
  // }
  getCryptoCards() {
    return this.authClientService.send('cryptocard.user.get', {});
  }

  // deleteCryptoCard(id: string) {
  //   return this.authClientService.send('cryptocard.delete', id);
  // }
}
