import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { GiftXdLogsService } from './gifXd-logs.service';
import { GIFT_XD_LOGS_DTOS } from '@app/dto';

@Controller('gift-xd logs')
export class GiftXdLogsController {
  constructor(private giftXdLogsService: GiftXdLogsService) {}
  @MessagePattern('giftXdLogs.create')
  async createCurrencyCode(model: GIFT_XD_LOGS_DTOS.createGiftXdLogs) {
    const data = await this.giftXdLogsService.createGifXdLogs(model);
    return data;
  }
}
