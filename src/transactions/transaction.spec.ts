import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsModule } from './transactions.module';
import { HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CommissionsService } from '../commissions/commissions.service';
import { TransactionSchema } from './transaction.model';

describe('AppController', () => {
  let transactionController: TransactionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TransactionsModule,
        MongooseModule.forRoot(
          'mongodb+srv://test:twom2GRON3bund*kaiy@cluster0.8g0s3.mongodb.net/nestjs-demo-api?retryWrites=true&w=majority',
        ),
        MongooseModule.forFeature([
          { name: 'Transaction', schema: TransactionSchema },
        ]),
        HttpModule,
      ],
      controllers: [TransactionsController],
      providers: [TransactionsService, CommissionsService],
    }).compile();

    transactionController = app.get<TransactionsController>(
      TransactionsController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const transactionMockData = {
        date: '2021-01-01T15:50:50',
        amount: '500.00',
        currency: 'USD',
        client_id: 9999999,
      };

      await transactionController.removeTransactionsByClientId(
        transactionMockData.client_id.toString(),
      );

      const commission = await transactionController.createTransaction(
        transactionMockData.date,
        transactionMockData.amount,
        transactionMockData.currency,
        transactionMockData.client_id,
      );

      expect(commission.commission_amount).toBe('2.06');
    });
  });
});
