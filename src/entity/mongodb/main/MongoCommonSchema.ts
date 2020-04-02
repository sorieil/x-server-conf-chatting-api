import { Schema } from 'mongoose';
import { AccountsSchema, AccountsI } from './MongoAccounts';

export const ReportSchema: Schema = new Schema({
    accountId: { type: AccountsSchema },
    createDt: { type: Date },
    reason: { type: String },
});

export interface ReportI extends Document {
    accountId: AccountsI;
    createDt: Date;
    reason: string;
}
