"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoCommunities_1 = require("./../../entity/mongodb/main/MongoCommunities");
class ServiceCommunities {
    constructor() { }
    getCommunitiesByEvenId(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield MongoCommunities_1.Communities.aggregate([
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
            yield new Promise(resolve => {
                console.log('query:', query.length);
                query.map((v) => {
                    console.log(v.comment);
                    if (typeof v.comment !== 'undefined') {
                        return v.comment.map((c) => Object.assign(c, {
                            name: '홍길동',
                            profileImg: 'https://ext.fmkorea.com/files/attach/new/20180423/486616/68365856/1028761637/d1e7bf10d56306f6b38d1ca690f2dbe1.jpeg',
                        }));
                    }
                    else {
                        return v;
                    }
                });
                resolve(query);
            });
            return query;
        });
    }
}
exports.default = ServiceCommunities;
//# sourceMappingURL=ServiceCommunities.js.map