import { Module } from '@nestjs/common';
import { LinkedAccountController } from './linked-account.controller';
import { LinkedAccountService } from './linked-account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftXdLogsService } from '../gifXd-logs/gifXd-logs.service';
import {
  USER_MODELS,
  LINKED_ACCOUNT_MODEL,
  LINKED_ACCOUNT_LIMIT_MODELS,
  GIFT_XD_LOGS_MODELS,
} from '@app/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LINKED_ACCOUNT_MODEL.LinkedAccount.name,
        schema: LINKED_ACCOUNT_MODEL.LinkedAccountSchema,
      },
      {
        name: GIFT_XD_LOGS_MODELS.GiftXdLogs.name,
        schema: GIFT_XD_LOGS_MODELS.GiftXdLogsSchema,
      },
      {
        name: LINKED_ACCOUNT_LIMIT_MODELS.AccountLimit.name,
        schema: LINKED_ACCOUNT_LIMIT_MODELS.LinkedAccountSchema,
      },
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
    ]),
  ],
  controllers: [LinkedAccountController],
  providers: [LinkedAccountService, GiftXdLogsService],
})
export class LinkedAccountModule {}
