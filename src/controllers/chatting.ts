import { firebaseDBAdmin, firebaseFCMAdmin } from './../util/firebase';
import { checkJoinedChattingMember } from './../util/validationCheck';
import {
    ChattingLists,
    ChattingListsI,
} from './../entity/mongodb/main/MongoChattingLists';
import {
    _MessageSchemaInChattingMessage,
    ChattingMessages,
    MessageI,
    ChattingMessagesI,
} from './../entity/mongodb/main/MongoChattingMessages';
import { Accounts, AccountsI } from './../entity/mongodb/main/MongoAccounts';
import { Event } from '../entity/mongodb/main/MongoEvent';

import { Request, Response } from 'express';
import { responseJson, RequestRole, tryCatch } from '../util/common';
import { validationResult, check, param, query, body } from 'express-validator';
import { checkTargetAccountIdAndEventIdExist } from '../util/validationCheck';
import ServiceChatting from '../service/mongodb/ServiceChatting';
import { resolve, method } from 'bluebird';
import mongodb from 'mongodb';

/**
 * 채팅 목록을 가져온다.
 */
const apiGet = [
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const event = new Event();
            const accounts = new Accounts();
            accounts._id = user._id;
            event._id = user.eventId;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            const serviceChatting = new ServiceChatting();
            const query: ChattingListsI[] = await serviceChatting.getChattingListByIdEventId(
                accounts,
                event,
            );

            for (let i = 0; i < query.length; i++) {
                const chattingListId = query[i]._id;
                query[i].notReadCount = await serviceChatting.getUnreadCount(
                    chattingListId,
                    accounts._id,
                );

                // for (let j = 0; j < query[i].membersInformation.length; j++) {
                //     const memberInformation = query[i].membersInformation[j];
                //     memberInformation.notReadCount = await serviceChatting.getUnreadCount(
                //          chattingListId,
                //          accounts._id,
                //     );
                // }
            }

            const convertQuery: any[] = await new Promise(resolve => {
                for (let i = 0; i < query.length; i++) {
                    const row = query[i];
                    for (let m = 0; m < row.membersInformation.length; m++) {
                        const user = row.membersInformation[m];
                        if (user._id.toString() === accounts._id.toString()) {
                            // delete row.membersInformation[m];
                            row.membersInformation.splice(m, 1);
                        }

                        delete user._id;
                    }
                }

                resolve(query);
            });

            // const queryFilter = query.map(v => {
            //     v.membersInformation = v.membersInformation.filter(
            //         (m: any) => m._id.toString() !== user._id.toString(),
            //     );

            //     return v;
            // });

            responseJson(res, convertQuery, method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

const apiGetNotReadCount = [
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const event = new Event();
            const accounts = new Accounts();
            accounts._id = user._id;
            event._id = user.eventId;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            const serviceChatting = new ServiceChatting();
            const totalNotReadCount = await serviceChatting.getTotalNotReadCount(
                accounts._id,
                event._id,
            );

            // const queryFilter = query.map(v => {
            //     v.membersInformation = v.membersInformation.filter(
            //         (m: any) => m._id.toString() !== user._id.toString(),
            //     );

            //     return v;
            // });

            const result = [
                {
                    format: 'number',
                    dataLabel: '읽지 않은 메세지 수',
                    type: 'totalNotReadCount',
                    value: totalNotReadCount,
                },
            ];

            responseJson(res, result, method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

/**
 * 채팅 목록의 자세한 정보를 가져온다.
 */
const apiGetDetail = [
    [checkJoinedChattingMember.apply(this)],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const accounts = new Accounts();
            accounts._id = user._id;

            // 정보는 위 권한 메서드에서 처리 합니다.
            // 결과 값음 req.chattingLists 로 출력 할 수 있습니다.

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            // 요청자의 정보와, 다른 맴버를 분리 합니다.
            const chattingLists = user.chattingLists as any;
            responseJson(res, chattingLists, method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

const apiPostStatusChange = [
    [
        param('chattingListId')
            .not()
            .isEmpty(),
    ],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const chattingListId = req.params.chattingListId;
            const user = req.user as any;
            const accounts = new Accounts();
            const chattingList = new ChattingLists();
            chattingList._id = req.params.chattingListId;
            const currentDate = new Date();
            accounts._id = user._id;

            //1. 어떤 채팅방인지 알아야겠지? => chattingListId를 받는 것으로 해결.

            //2. 그 채팅방에서 내가 읽지 않은 채팅 리스트를 조회(find $and)하여 한번에 변경($push)!
            //서비스쪽으로 빼고, $and에 날짜 넣기
            //읽기, 입력은 부하가 많이 걸리지는 않지만 풀스캐닝은 자제.
            const serviceChatting = new ServiceChatting();

            await ChattingMessages.updateMany(
                {
                    $and: [
                        { 'readMembers.accountId': { $nin: [user._id] } },
                        { chattingListId: chattingList._id },
                    ],
                },
                {
                    $push: {
                        readMembers: { accountId: user._id, date: currentDate },
                    },
                },
            );

            const result = [];
            result.push({
                data: [
                    {
                        message: 'Update message status complete!',
                    },
                ],
            });

            responseJson(res, result, method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

/**
 * 선택한 회원과 채팅 이 존재 하는지 체크 한다.
 */
const apiGetCheckChatHistory = [
    [
        param('targetAccountId')
            .not()
            .isEmpty(),
    ],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const accounts = new Accounts();
            const targetAccounts = new Accounts();
            targetAccounts._id = req.params.targetAccountId;
            accounts._id = user._id;

            // 정보는 위 권한 메서드에서 처리 합니다.
            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            const service = new ServiceChatting();
            console.log('userEventId', user.eventId);
            const query = await service.checkInitChattingHistory(
                accounts,
                targetAccounts,
                user.eventId,
            );

            responseJson(res, query, method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

/**
 * 채팅을 보낸다.
 * 채팅을 보낼때는 서버를 통해서 보낸다.
 * 그리고 매번 메세지를 보낼때마다 접속 위치를 기록한다.
 */
const apiPost = [
    [
        checkTargetAccountIdAndEventIdExist.apply(this),
        body('message')
            .optional()
            .isString(),
        body('imageUrl')
            .optional()
            .isString(),
        body('imageSize')
            .optional()
            .isNumeric(),
    ],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            // Event
            const event = new Event();

            //Account
            const accounts = new Accounts();
            accounts._id = user._id;
            event._id = user.eventId;

            // if (!errors.isEmpty()) {
            //     responseJson(res, errors.array(), method, 'invalid');
            //     return;
            // }

            if (req.body.message === undefined || req.body.message == '') {
                if (
                    req.body.imageUrl === undefined ||
                    req.body.imageSize === undefined
                ) {
                    responseJson(
                        res,
                        [{ error: 'Input message or image' }],
                        method,
                        'invalid',
                    );
                    return;
                }
            }

            const targetAccounts = new Accounts();
            const message = req.body.message;
            const imageUrl = req.body.imageUrl;
            const imageSize = req.body.imageSize;
            const serviceChatting = new ServiceChatting();

            targetAccounts._id = req.body.targetAccountId;

            const query = await serviceChatting.postSendMessage(
                accounts,
                targetAccounts,
                event,
                message,
                imageUrl,
                imageSize,
            );

            //발신자 이외의 사람들에게 푸시를 전송한다.

            responseJson(res, [query], method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

/**
 * 메세지만 전달
 */
const apiPostMessage = [
    [
        body('message')
            .not()
            .isEmpty()
            .isString(),
        body('imageUrl').isString(),
        body('imageSize').isNumeric(),
    ],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const accounts = new Accounts();
            accounts._id = user._id;

            // if (!errors.isEmpty()) {
            //     responseJson(res, errors.array(), method, 'invalid');
            //     return;
            // }

            if (req.body.message === undefined || req.body.message == '') {
                if (
                    req.body.imageUrl === undefined ||
                    req.body.imageSize === undefined
                ) {
                    responseJson(
                        res,
                        [{ error: 'Input message or image' }],
                        method,
                        'invalid',
                    );
                    return;
                }
            }

            const message = req.body.message;
            const imageUrl = req.body.imageUrl;
            const imageSize = req.body.imageSize;
            const serviceChatting = new ServiceChatting();
            const chattingLists = new ChattingLists();
            chattingLists._id = req.params.chattingListId;
            const queryChattingListId = await serviceChatting.checkChattingListIdExist(
                chattingLists,
            );

            if (queryChattingListId) {
                const query = await serviceChatting.postSendMessageById(
                    accounts,
                    chattingLists,
                    message,
                    imageUrl,
                    imageSize,
                );
                responseJson(res, [query], method, 'success');
            } else {
                responseJson(
                    res,
                    [{ message: '존재하지 않는 채팅입니다.' }],
                    method,
                    'fails',
                );
            }
            // 바로 메세지를 보낸다.
            // 실제로 존재하는 chattingListId 인지 체크 한다. (내부 로직에서 처리한다.)
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

const apiGetPushTest = [
    async (req: Request, res: Response) => {
        const serviceChatting = new ServiceChatting();
        const ObjectID = mongodb.ObjectID;
        const accountId: mongodb.ObjectID = new ObjectID(
            '5e55d779ad876d6a8819651e',
        );
        const eventId: mongodb.ObjectID = new ObjectID(
            '5e3bdc43ef9008503fcc123e',
        );
        const array = [];
        array.push({ _id: accountId });
        const accountList = await Accounts.find(
            {
                $and: [{ $or: array }, { 'eventList.eventId': eventId }],
            },
            {
                _id: 1,
                eventList: { $elemMatch: { eventId: eventId } },
            },
        );
        const pushTokenArray: string[] = [];
        // accountList.forEach(account => {
        //     pushTokenArray.push(account.eventList[0].pushToken);
        // });
        pushTokenArray.push(
            'e01n1bxhEao:APA91bGFiDUWjI048aBTyOjXvdrv3dhUxiQJ6Sf3obMGWIGYopTLho7glMmyTwgR8afnBXPVNr-QzZSiqWNQBV6XFZYTLNr-SUSXWYX_0wnqmtN77qz-Dyvhm2AU-nZe_Hvb0-yD4f7e',
        );
        console.log('pushTokenArray:::', pushTokenArray);
        let titleMsg = '채팅테스트';
        let contentMsg = '새 채팅 메시지가 도착했습니다!';
        let message = {
            notification: {
                title: titleMsg,
                body: contentMsg,
            },
            data: {
                eventId: eventId.toHexString(),
                featureType: 'alarmBox',
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
                console.log('response:::', response.responses[0].error);
                //responseJson(res, ['success!!'], null, 'success');
            })
            .catch(err => {
                console.log('error:::', err);
            });
        //console.log('pushTokenArray:::', pushTokenArray);
    },
];

export default {
    apiGet,
    apiGetPush: apiGetPushTest,
    apiPost,
    apiPostMessage,
    apiReadStatusChange: apiPostStatusChange,
    apiGetNotReadCount,
    apiGetDetail,
    apiGetCheckChatHistory,
};
