import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionServiceController', () => {
  let transactionServiceController: TransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    }).compile();

    transactionServiceController = app.get<TransactionController>(
      TransactionController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(transactionServiceController.getHello()).toBe('Hello World!');
    });
  });
});
