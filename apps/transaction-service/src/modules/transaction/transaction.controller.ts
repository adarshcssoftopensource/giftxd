import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { MessagePattern } from '@nestjs/microservices';
import { TRANSACTION_DTOS } from '@app/dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('transaction.create')
  async createTransaction(model: TRANSACTION_DTOS.TransactionCreateDto) {
    return this.transactionService.createTransaction(model);
  }

  @MessagePattern('transaction.getAll')
  async getAllTransaction(model: TRANSACTION_DTOS.FilterTransactionDto) {
    return this.transactionService.getAllTransaction(model);
  }
}
