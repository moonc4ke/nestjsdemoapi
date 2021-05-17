import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CommissionsService } from '../commissions/commissions.service';
import { TransactionSchema } from './transaction.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    HttpModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, CommissionsService],
})
export class TransactionsModule {}
