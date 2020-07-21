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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("./../util/firebase");
const validationCheck_1 = require("./../util/validationCheck");
const MongoChattingLists_1 = require("./../entity/mongodb/main/MongoChattingLists");
const MongoChattingMessages_1 = require("./../entity/mongodb/main/MongoChattingMessages");
const MongoAccounts_1 = require("./../entity/mongodb/main/MongoAccounts");
const MongoEvent_1 = require("../entity/mongodb/main/MongoEvent");
const common_1 = require("../util/common");
const express_validator_1 = require("express-validator");
const validationCheck_2 = require("../util/validationCheck");
const ServiceChatting_1 = __importDefault(require("../service/mongodb/ServiceChatting"));
const mongodb_1 = __importDefault(require("mongodb"));
/**
 * 채팅 목록을 가져온다.
 */
const apiGet = [
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            const event = new MongoEvent_1.Event();
            const accounts = new MongoAccounts_1.Accounts();
            accounts._id = user._id;
            event._id = user.eventId;
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const serviceChatting = new ServiceChatting_1.default();
            const query = yield serviceChatting.getChattingListByIdEventId(accounts, event);
            for (let i = 0; i < query.length; i++) {
                const chattingListId = query[i]._id;
                query[i].notReadCount = yield serviceChatting.getUnreadCount(chattingListId, accounts._id);
                // for (let j = 0; j < query[i].membersInformation.length; j++) {
                //     const memberInformation = query[i].membersInformation[j];
                //     memberInformation.notReadCount = await serviceChatting.getUnreadCount(
                //          chattingListId,
                //          accounts._id,
                //     );
                // }
            }
            const convertQuery = yield new Promise(resolve => {
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
            common_1.responseJson(res, convertQuery, method, 'success');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
const apiGetNotReadCount = [
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            const event = new MongoEvent_1.Event();
            const accounts = new MongoAccounts_1.Accounts();
            accounts._id = user._id;
            event._id = user.eventId;
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const serviceChatting = new ServiceChatting_1.default();
            const totalNotReadCount = yield serviceChatting.getTotalNotReadCount(accounts._id, event._id);
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
            common_1.responseJson(res, result, method, 'success');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
/**
 * 채팅 목록의 자세한 정보를 가져온다.
 */
const apiGetDetail = [
    [validationCheck_1.checkJoinedChattingMember.apply(this)],
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            const accounts = new MongoAccounts_1.Accounts();
            accounts._id = user._id;
            // 정보는 위 권한 메서드에서 처리 합니다.
            // 결과 값음 req.chattingLists 로 출력 할 수 있습니다.
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            // 요청자의 정보와, 다른 맴버를 분리 합니다.
            const chattingLists = user.chattingLists;
            common_1.responseJson(res, chattingLists, method, 'success');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
const apiPostStatusChange = [
    [
        express_validator_1.param('chattingListId')
            .not()
            .isEmpty(),
    ],
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const chattingListId = req.params.chattingListId;
            const user = req.user;
            const accounts = new MongoAccounts_1.Accounts();
            const chattingList = new MongoChattingLists_1.ChattingLists();
            chattingList._id = req.params.chattingListId;
            const currentDate = new Date();
            accounts._id = user._id;
            //1. 어떤 채팅방인지 알아야겠지? => chattingListId를 받는 것으로 해결.
            //2. 그 채팅방에서 내가 읽지 않은 채팅 리스트를 조회(find $and)하여 한번에 변경($push)!
            //서비스쪽으로 빼고, $and에 날짜 넣기
            //읽기, 입력은 부하가 많이 걸리지는 않지만 풀스캐닝은 자제.
            const serviceChatting = new ServiceChatting_1.default();
            yield MongoChattingMessages_1.ChattingMessages.updateMany({
                $and: [
                    { 'readMembers.accountId': { $nin: [user._id] } },
                    { chattingListId: chattingList._id },
                ],
            }, {
                $push: {
                    readMembers: { accountId: user._id, date: currentDate },
                },
            });
            const result = [];
            result.push({
                data: [
                    {
                        message: 'Update message status complete!',
                    },
                ],
            });
            common_1.responseJson(res, result, method, 'success');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
/**
 * 선택한 회원과 채팅 이 존재 하는지 체크 한다.
 */
const apiGetCheckChatHistory = [
    [
        express_validator_1.param('targetAccountId')
            .not()
            .isEmpty(),
    ],
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            const accounts = new MongoAccounts_1.Accounts();
            const targetAccounts = new MongoAccounts_1.Accounts();
            targetAccounts._id = req.params.targetAccountId;
            accounts._id = user._id;
            // 정보는 위 권한 메서드에서 처리 합니다.
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const service = new ServiceChatting_1.default();
            console.log('userEventId', user.eventId);
            const query = yield service.checkInitChattingHistory(accounts, targetAccounts, user.eventId);
            common_1.responseJson(res, query, method, 'success');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
/**
 * 채팅을 보낸다.
 * 채팅을 보낼때는 서버를 통해서 보낸다.
 * 그리고 매번 메세지를 보낼때마다 접속 위치를 기록한다.
 */
const apiPost = [
    [
        validationCheck_2.checkTargetAccountIdAndEventIdExist.apply(this),
        express_validator_1.body('message')
            .optional()
            .isString(),
        express_validator_1.body('imageUrl')
            .optional()
            .isString(),
        express_validator_1.body('imageSize')
            .optional()
            .isNumeric(),
    ],
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            // Event
            const event = new MongoEvent_1.Event();
            //Account
            const accounts = new MongoAccounts_1.Accounts();
            accounts._id = user._id;
            event._id = user.eventId;
            // if (!errors.isEmpty()) {
            //     responseJson(res, errors.array(), method, 'invalid');
            //     return;
            // }
            if (req.body.message === undefined || req.body.message == '') {
                if (req.body.imageUrl === undefined ||
                    req.body.imageSize === undefined) {
                    common_1.responseJson(res, [{ error: 'Input message or image' }], method, 'invalid');
                    return;
                }
            }
            const targetAccounts = new MongoAccounts_1.Accounts();
            const message = req.body.message;
            const imageUrl = req.body.imageUrl;
            const imageSize = req.body.imageSize;
            const serviceChatting = new ServiceChatting_1.default();
            targetAccounts._id = req.body.targetAccountId;
            const query = yield serviceChatting.postSendMessage(accounts, targetAccounts, event, message, imageUrl, imageSize);
            //발신자 이외의 사람들에게 푸시를 전송한다.
            common_1.responseJson(res, [query], method, 'success');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
/**
 * 메세지만 전달
 */
const apiPostMessage = [
    [
        express_validator_1.body('message')
            .not()
            .isEmpty()
            .isString(),
        express_validator_1.body('imageUrl').isString(),
        express_validator_1.body('imageSize').isNumeric(),
    ],
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            const accounts = new MongoAccounts_1.Accounts();
            accounts._id = user._id;
            // if (!errors.isEmpty()) {
            //     responseJson(res, errors.array(), method, 'invalid');
            //     return;
            // }
            if (req.body.message === undefined || req.body.message == '') {
                if (req.body.imageUrl === undefined ||
                    req.body.imageSize === undefined) {
                    common_1.responseJson(res, [{ error: 'Input message or image' }], method, 'invalid');
                    return;
                }
            }
            const message = req.body.message;
            const imageUrl = req.body.imageUrl;
            const imageSize = req.body.imageSize;
            const serviceChatting = new ServiceChatting_1.default();
            const chattingLists = new MongoChattingLists_1.ChattingLists();
            chattingLists._id = req.params.chattingListId;
            const queryChattingListId = yield serviceChatting.checkChattingListIdExist(chattingLists);
            if (queryChattingListId) {
                const query = yield serviceChatting.postSendMessageById(accounts, chattingLists, message, imageUrl, imageSize);
                common_1.responseJson(res, [query], method, 'success');
            }
            else {
                common_1.responseJson(res, [{ message: '존재하지 않는 채팅입니다.' }], method, 'fails');
            }
            // 바로 메세지를 보낸다.
            // 실제로 존재하는 chattingListId 인지 체크 한다. (내부 로직에서 처리한다.)
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
const apiGetPushTest = [
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const serviceChatting = new ServiceChatting_1.default();
        const ObjectID = mongodb_1.default.ObjectID;
        const accountId = new ObjectID('5e55d779ad876d6a8819651e');
        const eventId = new ObjectID('5e3bdc43ef9008503fcc123e');
        const array = [];
        array.push({ _id: accountId });
        const accountList = yield MongoAccounts_1.Accounts.find({
            $and: [{ $or: array }, { 'eventList.eventId': eventId }],
        }, {
            _id: 1,
            eventList: { $elemMatch: { eventId: eventId } },
        });
        const pushTokenArray = [];
        // accountList.forEach(account => {
        //     pushTokenArray.push(account.eventList[0].pushToken);
        // });
        pushTokenArray.push('e01n1bxhEao:APA91bGFiDUWjI048aBTyOjXvdrv3dhUxiQJ6Sf3obMGWIGYopTLho7glMmyTwgR8afnBXPVNr-QzZSiqWNQBV6XFZYTLNr-SUSXWYX_0wnqmtN77qz-Dyvhm2AU-nZe_Hvb0-yD4f7e');
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
        firebase_1.firebaseFCMAdmin
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
    }),
];
exports.default = {
    apiGet,
    apiGetPush: apiGetPushTest,
    apiPost,
    apiPostMessage,
    apiReadStatusChange: apiPostStatusChange,
    apiGetNotReadCount,
    apiGetDetail,
    apiGetCheckChatHistory,
};
//# sourceMappingURL=chatting.js.map