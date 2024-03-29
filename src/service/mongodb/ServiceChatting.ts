import { ChattingListsI } from './../../entity/mongodb/main/MongoChattingLists';
import {
    MessageI,
    ChattingMessages,
    ChattingMessagesI,
} from './../../entity/mongodb/main/MongoChattingMessages';
import {
    ChattingLists,
    MembersInChattingLists,
    MembersI,
} from './../../entity/mongodb/main/MongoChattingLists';
import { Event, EventI } from '../../entity/mongodb/main/MongoEvent';
import { Accounts, AccountsI } from '../../entity/mongodb/main/MongoAccounts';
import { firebaseDBAdmin, firebaseFCMAdmin } from '../../util/firebase';
import { Schema } from 'mongoose';
import mongodb, { ObjectID } from 'mongodb';
const db = firebaseDBAdmin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export default class ServiceChatting {
    constructor() {}

    public async getChattingListByIdEventId(
        accounts: AccountsI,
        event: EventI,
    ): Promise<any> {
        const targetEventIdStr: string = event._id;

        const query = await ChattingLists.aggregate([
            {
                $match: {
                    $and: [{ members: accounts._id }, { eventId: event._id }],
                },
            },
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'membersInformation',
                },
            },
            {
                $lookup: {
                    from: 'chattingmessages',
                    foreignField: 'chattingListId',
                    localField: '_id',
                    as: 'chatMsgList',
                },
            },
            {
                $addFields: {
                    lastMsgInfo: { $arrayElemAt: ['$chatMsgList', -1] },
                    notReadCount: {
                        $size: {
                            $filter: {
                                input: '$chatMsgList',
                                as: 'member',
                                cond: {
                                    $ne: ['$$member.accountId', accounts._id],
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    lastText: 1,
                    lastMsgInfo: 1,
                    status: 1,
                    updatedAt: 1,
                    membersInformation: {
                        _id: 1,
                        profiles: 1,
                        name: 1,
                        unReadCount: 1,
                    },
                    notReadCount: 1,
                },
            },
        ]);
        return query;
    }

    public async getUnreadMessages(
        chattingListId: Schema.Types.ObjectId,
        accountId: Schema.Types.ObjectId,
    ): Promise<ChattingMessagesI[]> {
        return ChattingMessages.find({
            $and: [
                { chattingListId: chattingListId },
                { 'readMembers.accountId': { $nin: [accountId] } },
            ],
        });
    }

    /**
     * 채팅 리스트를 부를 때 읽지 않은 메세지를 카운트하여 number로 출력.
     * @param chattingListId 채팅방 아이디 값
     * @param accountId 조회 하고자 하는 회원의 아이디 값
     */
    public async getUnreadCount(
        chattingListId: Schema.Types.ObjectId,
        accountId: Schema.Types.ObjectId,
    ): Promise<number> {
        return ChattingMessages.find({
            $and: [
                { chattingListId: chattingListId },
                { 'readMembers.accountId': { $nin: [accountId] } },
            ],
        }).countDocuments();
    }

    public async getTotalNotReadCount(
        accountId: Schema.Types.ObjectId,
        eventId: Schema.Types.ObjectId,
    ): Promise<number> {
        const chattingListIds = [];
        const chattingList = await ChattingLists.find({
            $and: [{ eventId: eventId }, { members: { $in: [accountId] } }],
        });
        for (let i = 0; i < chattingList.length; i++) {
            chattingListIds.push({
                chattingListId: chattingList[i]._id,
            });
        }
        if (chattingListIds.length > 0) {
            return await ChattingMessages.find({
                $and: [
                    { 'readMembers.accountId': { $nin: [accountId] } },
                    { $or: chattingListIds },
                ],
            }).countDocuments();
        } else {
            return 0;
        }
    }

    /**
     * 조회 하고자 하는 채팅방에 소속되어 있는지 체크 한다.
     * @param chattingLists 채팅방 아이디 값
     * @param accounts 조회 하고자 하는 회원의 아이디 값
     */
    public async getChattingById(
        chattingLists: ChattingListsI,
        accounts: AccountsI,
    ): Promise<ChattingListsI[]> {
        const query = await ChattingLists.find({
            _id: chattingLists._id,
            members: { $in: [accounts._id] },
        }).exec();
        return query;
    }

    /**
     * 조회 하고자 하는 채팅방에 소속된 맴버의 디테일한 정보를 가져온다.
     * @param chattingLists 채팅방 아이디 값
     * @param accounts 조회 하고자 하는 회원의 아이디 값
     */
    public async getChattingMemberDetailById(
        chattingLists: ChattingListsI,
        accounts: AccountsI,
    ): Promise<any[]> {
        const query = await ChattingLists.aggregate([
            {
                $match: {
                    _id: chattingLists._id,
                    members: { $in: [accounts._id] },
                },
            },
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'membersDetail',
                },
            },
            {
                $project: { membersDetail: { profiles: 1, name: 1, _id: 1 } },
            },
        ]).exec();
        // 여기에서 나와, 내가 아닌 맴버를 구분지어 줘야 한다.
        // 모던 방식과, For문 방식의 비교.. 코딩양...
        // const queryConvert = query.map((v: any) => {
        //     // 반복문을 한번만 돌려서 객체를 설정해준다.

        //     const me = v.membersDetail.filter(
        //         (f: any) => f._id.toString() === accounts._id.toString(),
        //     );
        //     const your = v.membersDetail.filter(
        //         (f: any) => f._id.toString() !== accounts._id.toString(),
        //     );

        //     return { me, your, id: v._id };
        // });
        const qc = await new Promise(async resolve => {
            const me = [];
            const your = [];

            for (let i = 0; i < query.length; i++) {
                const row = query[i];
                const rowMembers = row.membersDetail;
                // 맴버가 존재 하면,
                if (rowMembers.length > 0) {
                    // 자식 기준으로 For
                    for (let m = 0; m < rowMembers.length; m++) {
                        // 자식을 담아주고,
                        const member = rowMembers[m];
                        // 나와 내가 아닌 걸 분리
                        if (member._id.toString() === accounts._id.toString()) {
                            me.push(member);
                            //채팅방에 진입시 이 api를 꼭 부른다고 함.
                            //채팅방에 진입했을 경우 모든 메세지를 읽은 것으로 간주해야 함.
                            //따라서 진입했을 때, readMembers Array에 내 accountId가 없다면
                            //accountId를 readMembers에 집어넣어,
                            //notReadCount에 메세지들이 포함되지 않도록 해야 함.
                            const currentDate = new Date();
                            ChattingMessages.updateMany(
                                {
                                    $and: [
                                        { chattingListId: chattingLists._id },
                                        {
                                            'readMembers.accountId': {
                                                $nin: [accounts._id],
                                            },
                                        },
                                    ],
                                },
                                {
                                    $push: {
                                        readMembers: {
                                            accountId: accounts._id,
                                            date: currentDate,
                                        },
                                    },
                                },
                            );
                        } else {
                            your.push(member);
                        }
                    }
                } else {
                    //  자식이 없으면, 아무것도 하면 안되징..
                }
            }

            resolve({ me, your });
        });
        // 배열로 리턴
        return [qc];
    }

    // 대화가 처음인지 아닌지 체크
    public async checkInitChattingHistory(
        accounts: AccountsI,
        targetAccounts: AccountsI,
        eventId: Schema.Types.ObjectId,
    ) {
        console.log(accounts, targetAccounts);
        const query = ChattingLists.find({
            $and: [
                {
                    members: {
                        $all: [accounts._id, targetAccounts._id],
                    },
                },
                //{ eventId: { $in: [eventId] } },
            ],
        })
            .populate('members')
            .populate('membersInformation')
            .exec();

        return query;
    }

    /**
     *
     * @param accounts 메세지를 입력한 회원의 정보
     */
    async batchMember(accounts: AccountsI): Promise<any> {
        const saveMember = new MembersInChattingLists();
        saveMember._id = accounts._id;
        saveMember.name =
            typeof accounts.name === 'undefined' ? 'Null Name' : accounts.name;
        if (typeof accounts.profiles !== 'undefined') {
            saveMember.companyName =
                typeof accounts.profiles.companyName === 'undefined'
                    ? 'Null Company'
                    : accounts.profiles.companyName;
            saveMember.departmentName =
                typeof accounts.profiles.departmentName === 'undefined'
                    ? 'Null Department Name'
                    : accounts.profiles.departmentName;
        }

        return saveMember;
    }

    /**
     * 채팅 아이디가 없는 경우 사용하는 함수,
     * 채팅이 처음인경우 시작하는 함수
     * @param accounts 입력하는 사람의 정보
     * @param targetAccounts 채팅 대상
     * @param event 어떤 이벤트에서 채팅하는지
     * @param message 보내고자 하는 메세지
     */
    public async postSendMessage(
        accounts: AccountsI,
        targetAccounts: AccountsI,
        event: EventI,
        message: string,
        image: string,
        imageSize: number,
    ): Promise<any> {
        // 기존 채팅 내역이 있는지 체크 한다.
        const beforeChatting: ChattingListsI[] = await this.checkInitChattingHistory(
            accounts,
            targetAccounts,
            event._id,
        );

        /*
        1. 혹시 모를 데이터 무결성을 위해서 대화맴버 기준으로
           채팅을 조회 한다.
           
        2. 채팅의 상태를 업데이트 해준다.
           만약 없다면, 메세지를 입력하고나서
           채팅 list 를 생성을 해준다.

        3. 대화 참여회원 등록 (각 회원의 정보를 조회 해서 데이터를 넣어준다.)
           만약 대화 기록이 없다면, 대화를 초기화 해준다. 여기에서 맴버의 변화가 거의 없기 떄문에
           모든 데이터를 할때마다 해줄 필요는 없다.
        */

        // 채팅을 처음 생성할때...
        const currentDate = new Date();
        if (beforeChatting.length === 0) {
            // 타겟의 아이디로 정보를 조회해온다.
            const queryTargetAccounts: AccountsI = await Accounts.findById(
                targetAccounts._id,
            ).lean();

            // 맵버 지정
            const memberBucket: MembersI[] = [];
            memberBucket.push(await this.batchMember(accounts));
            memberBucket.push(await this.batchMember(queryTargetAccounts));

            //console.log('채팅 맴버 등록:', memberBucket);

            // 채팅방 생성
            const saveChattingList = new ChattingLists();
            saveChattingList.lastText = message;
            saveChattingList.createdAt = new Date();
            saveChattingList.updatedAt = new Date();
            saveChattingList.members = [accounts._id, targetAccounts._id];
            saveChattingList.membersInformation = memberBucket;
            saveChattingList.eventId = [event._id];
            saveChattingList.status = true;
            const initChattingList = await saveChattingList.save();

            // 채팅내용 저장

            const saveChattingMessage = new ChattingMessages();
            //console.log('image:::', image);
            if (image === undefined || image == '' || image === null) {
                saveChattingMessage.type = 'text';
                saveChattingMessage.image = '';
                saveChattingMessage.imageSize = 0;
            } else {
                saveChattingMessage.image = image;
                saveChattingMessage.imageSize = imageSize;
                saveChattingMessage.type = 'image';
            }
            saveChattingMessage.accountId = accounts._id;
            saveChattingMessage.createdAt = currentDate;
            saveChattingMessage.messages = message;
            saveChattingMessage.fileupload = [];
            saveChattingMessage.chattingListId = initChattingList._id;
            saveChattingMessage.readMembers = [
                {
                    accountId: accounts._id,
                    readDate: currentDate,
                },
            ];

            const query = await saveChattingMessage.save();
            await db
                .collection('chatting')
                .doc(initChattingList._id.toString()) // chatting id
                .collection('messages')
                .doc(query._id.toString())
                .set({
                    message: message,
                    type: saveChattingMessage.type,
                    image: saveChattingMessage.image,
                    imageSize: saveChattingMessage.imageSize,
                    accountId: accounts._id.toString(),
                    createdAt: new Date(),
                });

            return query;
        } else {
            // 기존의 채팅에 업데이트를 해준다.
            await ChattingLists.findByIdAndUpdate(beforeChatting[0]._id, {
                lastText: message,
                updatedAt: new Date(),
                $push: { eventId: event._id },
            });

            // 채팅내용 저장
            const saveChattingMessage = new ChattingMessages();
            //console.log('imageOld:::', image);
            if (image === undefined || image == '' || image === null) {
                saveChattingMessage.type = 'text';
                saveChattingMessage.image = '';
                saveChattingMessage.imageSize = 0;
            } else {
                saveChattingMessage.image = image;
                saveChattingMessage.imageSize = imageSize;
                saveChattingMessage.type = 'image';
            }
            saveChattingMessage.accountId = accounts._id;
            saveChattingMessage.createdAt = new Date();
            saveChattingMessage.messages = message;
            saveChattingMessage.fileupload = [];
            saveChattingMessage.chattingListId = beforeChatting[0]._id;
            saveChattingMessage.readMembers = [
                {
                    accountId: accounts._id,
                    readDate: currentDate,
                },
            ];
            const query = await saveChattingMessage.save();
            // console.log('chatting message id:', query);

            await db
                .collection('chatting')
                .doc(beforeChatting[0]._id.toString()) // chatting id
                .collection('messages')
                .doc(query._id.toString())
                .set({
                    message: message,
                    type: saveChattingMessage.type,
                    image: saveChattingMessage.image,
                    imageSize: saveChattingMessage.imageSize,
                    accountId: accounts._id.toString(),
                    createdAt: new Date(),
                });
            await this.sendPushMessage(
                accounts,
                [targetAccounts],
                event,
                event.name,
                query._id,
            );
            return query;
        }
    }

    public async postSendMessageById(
        accounts: AccountsI,
        chattingLists: ChattingListsI,
        message: string,
        image: string,
        imageSize: number,
    ): Promise<any> {
        const chattingList = new ChattingLists();
        chattingList.lastText = message;
        chattingList.updatedAt = new Date();

        // 채팅 상태 업데이트
        const update = await ChattingLists.findByIdAndUpdate(
            chattingLists._id,
            { lastText: message, updatedAt: new Date() },
        );
        //console.log('new ChattingList:', chattingList);
        //console.log('Received ChattingList:', chattingLists);
        //console.log('UpdateOne:', update);

        // 채팅내용 저장
        const saveChattingMessage = new ChattingMessages();
        const currentDate = new Date();
        //console.log('imageNew:::', image);
        if (image === undefined || image == '' || image === null) {
            //console.log('imageHello:::', image);
            saveChattingMessage.type = 'text';
            saveChattingMessage.image = '';
            saveChattingMessage.imageSize = 0;
        } else {
            saveChattingMessage.image = image;
            saveChattingMessage.imageSize = imageSize;
            saveChattingMessage.type = 'image';
        }

        saveChattingMessage.accountId = accounts._id;
        saveChattingMessage.createdAt = currentDate;
        saveChattingMessage.messages = message;
        saveChattingMessage.fileupload = [];
        saveChattingMessage.chattingListId = chattingLists._id;
        saveChattingMessage.readMembers = [
            {
                accountId: accounts._id,
                readDate: currentDate,
            },
        ];

        const query = await saveChattingMessage.save();
        // console.log('chatting message id:', query);
        await db
            .collection('chatting')
            .doc(chattingLists._id.toString()) // chatting id
            .collection('messages')
            .doc(query._id.toString())
            .set({
                message: message,
                type: saveChattingMessage.type,
                image: saveChattingMessage.image,
                imageSize: saveChattingMessage.imageSize,
                accountId: accounts._id.toString(),
                createdAt: new Date(),
            });
        const chattingMemberList = update.members;
        const pushTargetMemberList: AccountsI[] = [];
        chattingMemberList.forEach(memberId => {
            let pushTargetAccount = new Accounts();
            pushTargetAccount._id = memberId;
            pushTargetMemberList.push(pushTargetAccount);
        });
        //console.log('pushTarget:::', pushTargetMemberList);
        const eventId = update.eventId[0];
        //console.log('eventId:::::', eventId);
        const event = new Event();
        event._id = eventId;
        //targetAccountId: [Schema.Types.ObjectId],
        //eventId: Schema.Types.ObjectId,
        //eventName: string,
        await this.sendPushMessage(
            accounts,
            pushTargetMemberList,
            event,
            'Chatting',
            update._id,
        );
        return query;
    }

    public async checkChattingListIdExist(
        chattingList: ChattingListsI,
    ): Promise<any> {
        const query = ChattingLists.findById(chattingList._id).lean();
        return query;
    }

    public async sendPushMessage(
        //for senderId
        senderAccount: AccountsI,
        //for targetId
        targetAccounts: AccountsI[],
        //for eventId
        event: EventI,
        eventName: string,
        chattingListId: string,
    ) {
        //1. 푸시토큰 취득
        const findConditionArray: { _id: ObjectID }[] = [];
        let targetId;
        await targetAccounts.forEach(account => {
            if (account._id.toString() != senderAccount._id.toString()) {
                targetId = new ObjectID(account._id.toString());
                findConditionArray.push({
                    _id: targetId,
                });
            }
        });

        //console.log('conditionArray:::', findConditionArray);
        //console.log('eventId:::', event);
        const accountList = await Accounts.find({
            $or: findConditionArray,
        });
        const pushTokenArray: string[] = [];
        await accountList.forEach(account => {
            account.eventList.forEach(accountEvent => {
                //console.log('accountEvent:::', accountEvent.eventId);
                //console.log('event:::', event._id);
                if (accountEvent.eventId.toString() == event._id.toString()) {
                    pushTokenArray.push(accountEvent.pushToken);
                }
            });
        });
        //console.log('pushTokenArray:::', pushTokenArray);
        let titleMsg = eventName;
        let contentMsg = '새 채팅 메세지가 도착했습니다!';
        let message = {
            notification: {
                title: titleMsg,
                body: contentMsg,
            },
            data: {
                title: titleMsg,
                body: contentMsg,
                eventId: event._id.toString(),
                chatRoomId: String(chattingListId),
                featureType: 'chatting',
            },
            android: {
                ttl: 3600,
            },
            apns: {
                payload: {
                    aps: {
                        badge: 1,
                    },
                },
            },
            tokens: pushTokenArray,
        };
        firebaseFCMAdmin
            .messaging()
            .sendMulticast(message)
            .then(response => {
                console.log('response:::', response);
            })
            .catch(err => {
                console.log('error:::', err);
            });
    }
}
