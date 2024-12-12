import { Controller, Body, Post, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor, ResponseMessage } from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { GifXdLogsService } from './giftXd_logs.service';
import { GIFT_XD_LOGS_DTOS } from '@app/dto';

@Controller('giftXd-logs')
@ApiTags('giftXd-logs')
export class GifXdLogsController {
  constructor(private gifXdLogsService: GifXdLogsService) {}
  @Post('/create')
  @ResponseMessage('giftx-logs created')
  @UseInterceptors(ResponseInterceptor)
  createGftXdLogs(@Body() model: GIFT_XD_LOGS_DTOS.createGiftXdLogs) {
    return this.gifXdLogsService.createGftXdLogs(model);
  }
}
