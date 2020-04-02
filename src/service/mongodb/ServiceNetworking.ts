import { AccountsEventI } from './../../entity/mongodb/main/MongoAccounts';
import {
    ParticipantsFavorite,
    ParticipantsAccountsI,
    ParticipantsAccounts,
    ParticipantsFavoriteI,
} from './../../entity/mongodb/main/MongoParticipantsFavorite';
import { Accounts, AccountsI } from '../../entity/mongodb/main/MongoAccounts';
import { Types, Schema } from 'mongoose';
import { EventI } from '../../entity/mongodb/main/MongoEvent';
export default class ServiceNetworking {
    constructor() {}

    /**
     * 이벤트 참여자 목록을 출력한다.
     * @param accountsEvent
     */
    public async getEventParticipantsLists(
        accounts: AccountsI,
        accountsEvent: AccountsEventI,
    ): Promise<any[]> {
        const query = await Accounts.find({
            'eventList.eventId': accountsEvent._id,
        })
            .select({
                name: 1,
                profiles: 1,
            })
            .lean();

        const queryParticipantsFavorite = await ParticipantsFavorite.findOne({
            accountId: accounts._id,
        }).lean();
        // 북마크를 체크해준다.
        const checkFavorite: any[] = await new Promise(resolve => {
            const bucketQuery: any[] = [];
            for (let i in query) {
                if (queryParticipantsFavorite) {
                    const checkFavorite = queryParticipantsFavorite.favoriteAccounts.filter(
                        (v: any) => {
                            return v.accountId.equals(query[i]._id);
                        },
                    );
                    bucketQuery.push(
                        Object.assign({}, query[i], {
                            favorite:
                                checkFavorite.length > 0
                                    ? checkFavorite[0]._id
                                    : false,
                        }),
                    );
                } else {
                    bucketQuery.push(
                        Object.assign({}, query[i], {
                            favorite: false,
                        }),
                    );
                }
            }
            resolve(bucketQuery);
        });

        return checkFavorite;
    }

    public async saveParticipantsFavorite(
        targetAccount: AccountsI,
        accounts: AccountsI,
        event: EventI,
    ): Promise<any> {
        // 이미 등록 되어 있으면, 등록을 하지 않는다.
        const participantsFavorite = await ParticipantsFavorite.findOne({
            eventId: event._id,
            accountId: accounts._id,
            // 'favoriteAccounts.accountId': targetAccount._id,
        }).lean();

        const participantsAccounts = new ParticipantsAccounts();
        participantsAccounts.accountId = targetAccount._id;
        participantsAccounts.createDt = new Date();

        // 없으면 새로 입력
        if (participantsFavorite === null) {
            const saveQuery = new ParticipantsFavorite();
            saveQuery.eventId = event._id;
            saveQuery.accountId = accounts._id;
            saveQuery.createDt = new Date();
            saveQuery.favoriteAccounts.push(participantsAccounts);
            const result = await saveQuery.save();

            // 성공여부
            if (result) {
                return { message: '신규 등록 성공' };
            } else {
                return { message: '신규 등록 실패' };
            }
        } else {
            // 있으면, 기존거에 추가 하는데
            const checkFavoriteAccounts = participantsFavorite.favoriteAccounts.filter(
                (c: any) => {
                    console.log(`${c.accountId} - ${targetAccount._id}`);
                    return c.accountId.equals(targetAccount._id);
                },
            );

            console.log('checkFavoriteAccounts length:', checkFavoriteAccounts);

            // 입력된게 없으면, 추가 해서 업데이트 해준다.
            if (checkFavoriteAccounts.length === 0) {
                console.log('target account id:', participantsAccounts);
                participantsFavorite.favoriteAccounts.push(
                    participantsAccounts,
                );

                // 즐겨찾기 추가
                const result = await ParticipantsFavorite.updateOne(
                    {
                        _id: participantsFavorite._id,
                    },
                    {
                        favoriteAccounts: participantsFavorite.favoriteAccounts,
                    },
                ).lean();
                if (result) {
                    return { message: '추가 완료' };
                } else {
                    return { message: '추가 실패' };
                }
            } else {
                return { message: '이미 존재합니다.' };
            }
        }
    }

    public async deleteParticipantsFavorite(
        account: AccountsI,
        favorite: ParticipantsAccountsI,
        event: EventI,
    ): Promise<any> {
        const participantsFavorite = await ParticipantsFavorite.findOne({
            eventId: event._id,
            accountId: account._id,
            'favoriteAccounts._id': favorite._id,
        }).lean();
        console.log('favorite:', participantsFavorite);

        if (participantsFavorite === null) {
            return { message: '이미 삭제 되었습니다.' };
        } else {
            // 해당하는 즐겨찾기의 아이디를 뺀다.
            const favoriteAccounts: ParticipantsAccountsI[] = await new Promise(
                resolve => {
                    const qq = participantsFavorite.favoriteAccounts.filter(
                        (v: ParticipantsAccountsI) => {
                            return !v._id.equals(favorite._id);
                        },
                    );

                    resolve(qq);
                },
            );

            console.log('delete result:', favoriteAccounts);
            participantsFavorite.favoriteAccounts = favoriteAccounts;
            await ParticipantsFavorite.updateOne(
                {
                    eventId: event._id,
                    accountId: account._id,
                },
                { favoriteAccounts: participantsFavorite.favoriteAccounts },
            );
            return { message: '삭제 완료' };
        }
    }
}
