import { Communities } from './../../entity/mongodb/main/MongoCommunities';
import { EventI } from './../../entity/mongodb/main/MongoEvent';
export default class ServiceCommunities {
    constructor() {}

    public async getCommunitiesByEvenId(event: EventI): Promise<any[]> {
        const query = await Communities.aggregate([
            { $match: { eventId: event._id } },
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'accountId',
                    foreignField: '_id',
                    as: 'accountDetail',
                },
            },
            {
                $project: {
                    _id: 1,
                    tags: 1,
                    viewer: 1,
                    eventId: 1,
                    title: 1,
                    body: 1,
                    subject: 1,
                    createDt: 1,
                    comment: 1,
                    imageUrl: 1,
                    viewCount: 1,
                    likeCount: 1,
                    accumulateViewCount: 1,
                    commentCount: 1,
                    accountDetail: {
                        name: 1,
                        id: 1,
                    },
                },
            },
        ]).exec();

        await new Promise(resolve => {
            console.log('query:', query.length);
            query.map((v: any) => {
                console.log(v.comment);
                if (typeof v.comment !== 'undefined') {
                    return v.comment.map((c: any) =>
                        Object.assign(c, {
                            name: '홍길동',
                            profileImg:
                                'https://ext.fmkorea.com/files/attach/new/20180423/486616/68365856/1028761637/d1e7bf10d56306f6b38d1ca690f2dbe1.jpeg',
                        }),
                    );
                } else {
                    return v;
                }
            });

            resolve(query);
        });

        return query;
    }
}
