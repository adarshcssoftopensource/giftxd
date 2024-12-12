import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ORDER_MODELS, TRANSACTION_MODELS } from '@app/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TRANSACTION_MODELS.Transaction.name,
        schema: TRANSACTION_MODELS.TransactionSchema,
      },

      {
        name: ORDER_MODELS.Order.name,
        schema: ORDER_MODELS.OrderSchema,
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
