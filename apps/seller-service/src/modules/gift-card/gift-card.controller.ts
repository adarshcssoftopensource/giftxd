import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GiftCardService } from './gift-card.service';
import { ORDER_DTOS } from '@app/dto';
@Controller('gift-card')
export class GiftCardController {
  constructor(private giftCardService: GiftCardService) {}
  @MessagePattern('gift_card.uploads')
  userCardUpload(model: ORDER_DTOS.CreateUserCardFileDto) {
    return this.giftCardService.uploadFiles(model);
  }
  @MessagePattern('gift_card.getByOffer')
  getUserCards(model: ORDER_DTOS.GetUserCardDto) {
    return this.giftCardService.getUserCards(model);
  }
}
