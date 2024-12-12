import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCardService } from './user-card.service';
import { ORDER_DTOS } from '@app/dto';
@Controller('user-card')
export class UserCardController {
  constructor(private userCardService: UserCardService) {}
  @MessagePattern('user_card.uploads')
  userCardUpload(model: ORDER_DTOS.CreateUserCardFileDto) {
    return this.userCardService.uploadFiles(model);
  }
  @MessagePattern('user_card.getByUser')
  getUserCards(model: ORDER_DTOS.GetUserCardDto) {
    return this.userCardService.getUserCards(model);
  }
}
