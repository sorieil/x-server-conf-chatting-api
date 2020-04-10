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
const MongoChattingLists_1 = require("./../entity/mongodb/main/MongoChattingLists");
const MongoAccounts_1 = require("./../entity/mongodb/main/MongoAccounts");
const MongoEvent_1 = require("../entity/mongodb/main/MongoEvent");
const common_1 = require("../util/common");
const express_validator_1 = require("express-validator");
const validationCheck_1 = require("../util/validationCheck");
const ServiceChatting_1 = __importDefault(require("../service/mongodb/ServiceChatting"));
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
 * TODO 조건: 유저의 마지먹 접속 디바이스를 조회 하고, 5분이 이상 api 통신 이력이 없는 경우, 모바일로 푸쉬를 보내준다.
 * 그리고 매번 메세지를 보낼때마다 접속 위치를 기록한다.
 */
const apiPost = [
    [
        validationCheck_1.checkTargetAccountIdEventIdExist.apply(this),
        express_validator_1.body('targetAccountId')
            .not()
            .isEmpty()
            .isString(),
        express_validator_1.body('message')
            .not()
            .isEmpty()
            .isString(),
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
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const targetAccounts = new MongoAccounts_1.Accounts();
            const message = req.body.message;
            const serviceChatting = new ServiceChatting_1.default();
            targetAccounts._id = req.body.targetAccountId;
            const query = yield serviceChatting.postSendMessage(accounts, targetAccounts, event, message);
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
    ],
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            const accounts = new MongoAccounts_1.Accounts();
            accounts._id = user._id;
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const message = req.body.message;
            const serviceChatting = new ServiceChatting_1.default();
            const chattingLists = new MongoChattingLists_1.ChattingLists();
            chattingLists._id = req.params.chattingListId;
            const queryChattingListId = yield serviceChatting.checkChattingListIdExist(chattingLists);
            if (queryChattingListId) {
                const query = yield serviceChatting.postSendMessageById(accounts, chattingLists, message);
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
exports.default = {
    apiGet,
    apiPost,
    apiPostMessage,
};
//# sourceMappingURL=chatting.js.map