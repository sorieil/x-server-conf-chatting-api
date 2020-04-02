import { query } from 'express-validator';
import { Accounts, AccountsI } from '../../entity/mongodb/main/MongoAccounts';
import { EventI } from '../../entity/mongodb/main/MongoEvent';
export default class ServiceAccounts {
    constructor() {}
    public async getAccounts(): Promise<AccountsI[]> {
        return Accounts.find().limit(10);
    }

    public async getById(accounts: AccountsI): Promise<AccountsI> {
        const query = Accounts.findById(accounts._id);
        return query;
    }

    public async getEventParticipantsLists(event: EventI): Promise<any[]> {
        const query = await Accounts.find({
            'eventList.eventId': event._id,
        })
            .select({
                name: 1,
                profiles: 1,
            })
            .lean();

        // 즐겨 찾기 비교
        const checkFavorite: any[] = await new Promise(resolve => {
            const bucketQuery: any[] = [];
            for (let i in query) {
                bucketQuery.push(
                    Object.assign({}, query[i], { favorite: false }),
                );
            }
            resolve(bucketQuery);
        });

        return checkFavorite;
    }
}
