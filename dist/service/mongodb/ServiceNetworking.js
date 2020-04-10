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
const MongoParticipantsFavorite_1 = require("./../../entity/mongodb/main/MongoParticipantsFavorite");
const MongoAccounts_1 = require("../../entity/mongodb/main/MongoAccounts");
class ServiceNetworking {
    constructor() { }
    /**
     * 이벤트 참여자 목록을 출력한다.
     * @param accountsEvent
     */
    getEventParticipantsLists(accounts, accountsEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield MongoAccounts_1.Accounts.find({
                'eventList.eventId': accountsEvent._id,
            })
                .select({
                name: 1,
                profiles: 1,
            })
                .lean();
            const queryParticipantsFavorite = yield MongoParticipantsFavorite_1.ParticipantsFavorite.findOne({
                accountId: accounts._id,
            }).lean();
            // 북마크를 체크해준다.
            const checkFavorite = yield new Promise(resolve => {
                const bucketQuery = [];
                for (let i in query) {
                    if (queryParticipantsFavorite) {
                        const checkFavorite = queryParticipantsFavorite.favoriteAccounts.filter((v) => {
                            return v.accountId.equals(query[i]._id);
                        });
                        bucketQuery.push(Object.assign({}, query[i], {
                            favorite: checkFavorite.length > 0
                                ? checkFavorite[0]._id
                                : false,
                        }));
                    }
                    else {
                        bucketQuery.push(Object.assign({}, query[i], {
                            favorite: false,
                        }));
                    }
                }
                resolve(bucketQuery);
            });
            return checkFavorite;
        });
    }
    saveParticipantsFavorite(targetAccount, accounts, event) {
        return __awaiter(this, void 0, void 0, function* () {
            // 이미 등록 되어 있으면, 등록을 하지 않는다.
            const participantsFavorite = yield MongoParticipantsFavorite_1.ParticipantsFavorite.findOne({
                eventId: event._id,
                accountId: accounts._id,
            }).lean();
            const participantsAccounts = new MongoParticipantsFavorite_1.ParticipantsAccounts();
            participantsAccounts.accountId = targetAccount._id;
            participantsAccounts.createDt = new Date();
            // 없으면 새로 입력
            if (participantsFavorite === null) {
                const saveQuery = new MongoParticipantsFavorite_1.ParticipantsFavorite();
                saveQuery.eventId = event._id;
                saveQuery.accountId = accounts._id;
                saveQuery.createDt = new Date();
                saveQuery.favoriteAccounts.push(participantsAccounts);
                const result = yield saveQuery.save();
                // 성공여부
                if (result) {
                    return { message: '신규 등록 성공' };
                }
                else {
                    return { message: '신규 등록 실패' };
                }
            }
            else {
                // 있으면, 기존거에 추가 하는데
                const checkFavoriteAccounts = participantsFavorite.favoriteAccounts.filter((c) => {
                    console.log(`${c.accountId} - ${targetAccount._id}`);
                    return c.accountId.equals(targetAccount._id);
                });
                console.log('checkFavoriteAccounts length:', checkFavoriteAccounts);
                // 입력된게 없으면, 추가 해서 업데이트 해준다.
                if (checkFavoriteAccounts.length === 0) {
                    console.log('target account id:', participantsAccounts);
                    participantsFavorite.favoriteAccounts.push(participantsAccounts);
                    // 즐겨찾기 추가
                    const result = yield MongoParticipantsFavorite_1.ParticipantsFavorite.updateOne({
                        _id: participantsFavorite._id,
                    }, {
                        favoriteAccounts: participantsFavorite.favoriteAccounts,
                    }).lean();
                    if (result) {
                        return { message: '추가 완료' };
                    }
                    else {
                        return { message: '추가 실패' };
                    }
                }
                else {
                    return { message: '이미 존재합니다.' };
                }
            }
        });
    }
    deleteParticipantsFavorite(account, favorite, event) {
        return __awaiter(this, void 0, void 0, function* () {
            const participantsFavorite = yield MongoParticipantsFavorite_1.ParticipantsFavorite.findOne({
                eventId: event._id,
                accountId: account._id,
                'favoriteAccounts._id': favorite._id,
            }).lean();
            console.log('favorite:', participantsFavorite);
            if (participantsFavorite === null) {
                return { message: '이미 삭제 되었습니다.' };
            }
            else {
                // 해당하는 즐겨찾기의 아이디를 뺀다.
                const favoriteAccounts = yield new Promise(resolve => {
                    const qq = participantsFavorite.favoriteAccounts.filter((v) => {
                        return !v._id.equals(favorite._id);
                    });
                    resolve(qq);
                });
                console.log('delete result:', favoriteAccounts);
                participantsFavorite.favoriteAccounts = favoriteAccounts;
                yield MongoParticipantsFavorite_1.ParticipantsFavorite.updateOne({
                    eventId: event._id,
                    accountId: account._id,
                }, { favoriteAccounts: participantsFavorite.favoriteAccounts });
                return { message: '삭제 완료' };
            }
        });
    }
}
exports.default = ServiceNetworking;
//# sourceMappingURL=ServiceNetworking.js.map