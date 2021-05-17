import { HttpService } from '@nestjs/common';
import {
  TransactionRequest,
  Transaction,
} from '../transactions/transaction.model';
import { Commission } from './commission.model';

export class CommissionsService {
  transTurnover = 0;
  conversionRate: number;

  async calculateCommission(
    transaction: TransactionRequest,
    http: HttpService,
    transactions: Transaction[],
  ): Promise<Commission> {
    const transAmount = await this.currencyHandler(
      transaction.amount,
      transaction.currency,
      http,
    );

    let commission = +transAmount * 0.005;
    commission = this.smallCommissionAdjust(commission);
    commission = this.specialCommissionDiscount(
      commission,
      transaction.client_id,
    );
    commission = this.commissionDiscount(commission, transactions);

    return {
      commission_amount: commission.toFixed(2).toString(),
      commission_currency: 'EUR',
    };
  }

  private commissionDiscount(commission: number, transactions: Transaction[]) {
    transactions.forEach((transaction) => {
      let transAmount = +transaction.amount;
      if (transaction.currency !== 'EUR') {
        transAmount = +transaction.amount * this.conversionRate;
      }

      this.transTurnover += transAmount;
    });

    if (this.transTurnover > 1000) {
      return 0.04;
    }

    return commission;
  }

  private specialCommissionDiscount(commission: number, clientId: number) {
    if (clientId === 42) {
      return 0.05;
    }

    return commission;
  }

  private smallCommissionAdjust(commission: number) {
    if (commission < 0.05) {
      return 0.05;
    }

    return commission;
  }

  private async currencyHandler(
    amount: string,
    currency: string,
    http: HttpService,
  ) {
    if (currency !== 'EUR') {
      this.conversionRate = await this.transactionConversionRate(
        http,
        currency,
      );

      return +amount * this.conversionRate;
    }

    return +amount;
  }

  private async transactionConversionRate(
    http: HttpService,
    currency: string,
  ): Promise<number> {
    const conversion = await http
      .get(`https://api.ratesapi.io/api/latest?base=${currency}&symbols=EUR`)
      .toPromise();

    return conversion.data.rates.EUR;
  }
}
