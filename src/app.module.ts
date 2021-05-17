import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TransactionsModule,
    MongooseModule.forRoot(
      'mongodb+srv://test:twom2GRON3bund*kaiy@cluster0.8g0s3.mongodb.net/nestjs-demo-api?retryWrites=true&w=majority',
    ),
  ],
})
export class AppModule {}
