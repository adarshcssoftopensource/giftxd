import { Module } from '@nestjs/common';
import { GifXdLogsService } from './giftXd_logs.service';
import { GifXdLogsController } from './gifXd_logs.controller';
@Module({
  providers: [GifXdLogsService],
  controllers: [GifXdLogsController],
})
export class GifXdLogsModule {}
