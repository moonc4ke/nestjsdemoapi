import * as mongoose from 'mongoose';

export const TransactionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  amount: { type: String, required: true },
  currency: { type: String, required: true },
  client_id: { type: Number, required: true },
  commission_amount: { type: String, required: true },
  commission_currency: { type: String, required: true },
});

export interface TransactionRequest {
  date: string;
  amount: string;
  currency: string;
  client_id: number;
}

export interface Transaction extends mongoose.Document {
  id: string;
  date: string;
  amount: string;
  currency: string;
  client_id: number;
  commission_amount: string;
  commission_currency: string;
}
