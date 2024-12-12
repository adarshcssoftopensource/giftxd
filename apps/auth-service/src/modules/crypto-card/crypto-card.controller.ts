import { MessagePattern } from '@nestjs/microservices';
import { CryptoCardService } from './crypto-card.service';
import { Controller } from '@nestjs/common';
import { USER_DTOS } from '@app/dto';

@Controller('cryptocards')
export class CryptoCardController {
  constructor(private cryptocardService: CryptoCardService) {}

  @MessagePattern('cryptocard.create')
  createCryptoCard(model: USER_DTOS.CryptoCreateDto) {
    const data = this.cryptocardService.createCryptoCard(model);
    return data;
  }
  @MessagePattern('cryptocard.user.get')
  getCryptoCards() {
    return this.cryptocardService.getCryptoCards();
  }

  @MessagePattern('cryptocard.delete')
  deleteCryptoCard(id: string) {
    return this.cryptocardService.deleteById(id);
  }
}
