import { Injectable, NotFoundException, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './transaction.model';
import { CommissionsService } from '../commissions/commissions.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
    private readonly commissionService: CommissionsService,
  ) {}

  async createTransaction(
    http: HttpService,
    date: string,
    amount: string,
    currency: string,
    client_id: number,
  ) {
    const filteredTransactions = await this.getTransactionsByClientId(
      client_id,
    );
    const commission = await this.commissionService.calculateCommission(
      {
        date,
        amount,
        currency,
        client_id,
      },
      http,
      filteredTransactions,
    );

    const newTransaction = new this.transactionModel({
      date,
      amount,
      currency,
      client_id,
      commission_amount: commission.commission_amount,
      commission_currency: commission.commission_currency,
    });

    await newTransaction.save();

    return commission;
  }

  async getTransactions() {
    const transactions = await this.transactionModel.find().exec();

    return transactions.map((trans) => ({
      id: trans.id,
      date: trans.date,
      amount: trans.amount,
      currency: trans.currency,
      client_id: trans.client_id,
      commission_amount: trans.commission_amount,
      commission_currency: trans.commission_currency,
    }));
  }

  private async getTransactionsByClientId(clientId: number) {
    const transactions = await this.transactionModel.find().exec();

    return transactions.filter((trans) => trans.client_id === clientId);
  }

  async getTransByClientIdFormatted(clientId: number) {
    return (await this.getTransactionsByClientId(clientId)).map((trans) => ({
      id: trans.id,
      date: trans.date,
      amount: trans.amount,
      currency: trans.currency,
      client_id: trans.client_id,
      commission_amount: trans.commission_amount,
      commission_currency: trans.commission_currency,
    }));
  }

  async getSingleTransaction(transactionId: string) {
    const transaction = await this.findTransaction(transactionId);

    return {
      id: transaction.id,
      date: transaction.date,
      amount: transaction.amount,
      currency: transaction.currency,
      client_id: transaction.client_id,
      commission_amount: transaction.commission_amount,
      commission_currency: transaction.commission_currency,
    };
  }

  async updateTransaction(
    transId: string,
    date: string,
    amount: string,
    currency: string,
    client_id: number,
    commission_amount: string,
    commission_currency: string,
  ) {
    const updatedTransaction = await this.findTransaction(transId);

    if (date) {
      updatedTransaction.date = date;
    }

    if (amount) {
      updatedTransaction.amount = amount;
    }

    if (currency) {
      updatedTransaction.currency = currency;
    }

    if (client_id) {
      updatedTransaction.client_id = client_id;
    }

    if (commission_amount) {
      updatedTransaction.commission_amount = commission_amount;
    }

    if (commission_currency) {
      updatedTransaction.commission_currency = commission_currency;
    }

    updatedTransaction.save();
  }

  async deleteTransaction(transId: string) {
    let result;

    try {
      result = await this.transactionModel.deleteOne({ _id: transId }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find transaction.');
    }

    if (result.n === 0) {
      throw new NotFoundException('Could not find transaction.');
    }
  }

  async deleteTransByClientId(clientId: string) {
    const result = await this.transactionModel
      .deleteMany({ client_id: +clientId })
      .exec();
    if (result.n === 0) {
      return null;
    }
  }

  private async findTransaction(id: string): Promise<Transaction> {
    let transaction;

    try {
      transaction = await this.transactionModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find transaction.');
    }

    if (!transaction) {
      throw new NotFoundException('Could not find transaction.');
    }

    return transaction;
  }
}
