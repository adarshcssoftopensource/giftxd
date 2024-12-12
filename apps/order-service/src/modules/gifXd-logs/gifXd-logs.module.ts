import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftXdLogsService } from './gifXd-logs.service';
import { GiftXdLogsController } from './gifXd-logs.controller';
import { GIFT_XD_LOGS_MODELS, ORDER_MODELS } from '@app/schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GIFT_XD_LOGS_MODELS.GiftXdLogs.name,
        schema: GIFT_XD_LOGS_MODELS.GiftXdLogsSchema,
      },
      {
        name: ORDER_MODELS.Order.name,
        schema: ORDER_MODELS.OrderSchema,
      },
    ]),
  ],
  controllers: [GiftXdLogsController],
  providers: [GiftXdLogsService],
})
export class GiftXdLogsModule {}
