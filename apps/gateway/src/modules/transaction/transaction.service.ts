import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TRANSACTION_DTOS } from '@app/dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_CLIENT_SERVICE')
    private readonly transactionClientService: ClientProxy,
  ) {}

  createTransaction(model: TRANSACTION_DTOS.TransactionCreateDto) {
    return this.transactionClientService.send('transaction.create', model);
  }

  getAllTransaction(query: TRANSACTION_DTOS.FilterTransactionDto) {
    return this.transactionClientService.send('transaction.getAll', query);
  }
}
