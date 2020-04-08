import { AccountsEventI } from '../../entity/mongodb/main/MongoAccounts';
import { EventI } from '../../entity/mongodb/main/MongoEvent';
import { Accounts, AccountsI } from '../../entity/mongodb/main/MongoAccounts';
import { Types } from 'mongoose';
export default class ServiceSample {
    constructor() {}

    public async getAccountById(accounts: AccountsI): Promise<any> {
        const query = await Accounts.findById(accounts._id).lean();
        return query;
    }

    public async getAccountByIdEventId(
        accounts: AccountsI,
        accountsEvent: AccountsEventI,
    ): Promise<any> {
        console.log(accounts, accountsEvent);
        const query = await Accounts.findOne({
            _id: accounts._id,
            'eventList.eventId': accountsEvent._id,
        }).lean();
        return query;
    }
}
