import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpService,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly http: HttpService,
  ) {}

  @Post()
  async createTransaction(
    @Body('date') transDate: string,
    @Body('amount') transAmount: string,
    @Body('currency') transCurr: string,
    @Body('client_id') transClientId: number,
  ) {
    const commission = await this.transactionsService.createTransaction(
      this.http,
      transDate,
      transAmount,
      transCurr,
      transClientId,
    );

    return commission;
  }

  @Get()
  async getAllTransactions() {
    const transactions = await this.transactionsService.getTransactions();

    return transactions;
  }

  @Get('/client/:id')
  async getTransactionsByClientId(@Param('id') clientId: string) {
    const transactions =
      await this.transactionsService.getTransByClientIdFormatted(+clientId);

    if (!transactions) {
      return null;
    }

    return transactions;
  }

  @Get(':id')
  getTransaction(@Param('id') transId: string) {
    return this.transactionsService.getSingleTransaction(transId);
  }

  @Patch(':id')
  async updateTransaction(
    @Param('id') transId: string,
    @Body('date') transDate: string,
    @Body('amount') transAmount: string,
    @Body('currency') transCurrency: string,
    @Body('client_id') transClientId: number,
    @Body('commission_amount') transComAmount: string,
    @Body('commission_currency') transComCurrency: string,
  ) {
    await this.transactionsService.updateTransaction(
      transId,
      transDate,
      transAmount,
      transCurrency,
      transClientId,
      transComAmount,
      transComCurrency,
    );

    return null;
  }

  @Delete(':id')
  async removeTransaction(@Param('id') transId: string) {
    await this.transactionsService.deleteTransaction(transId);

    return null;
  }

  @Delete('/client/:id')
  async removeTransactionsByClientId(@Param('id') clientId: string) {
    await this.transactionsService.deleteTransByClientId(clientId);

    return null;
  }
}
