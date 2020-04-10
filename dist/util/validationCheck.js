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
const express_validator_1 = require("express-validator");
const ServiceAuth_1 = __importDefault(require("../service/mongodb/ServiceAuth"));
const MongoAccounts_1 = require("../entity/mongodb/main/MongoAccounts");
/**
 * 이벤트 아이디와, 조회를 하려는 회원이 해당 이벤트에 참여한 회원인지 체크 한다.
 * @targetAccountId 찾고자 하는 회원의 아이디 값.
 * @eventId 토큰 기준으로 이벤트 아이디를 가져온다.
 * @return req.body.targetAccountId
 */
exports.checkTargetAccountIdEventIdExist = () => {
    return express_validator_1.body('targetAccountId').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const serviceAuth = new ServiceAuth_1.default();
        const account = new MongoAccounts_1.Accounts();
        const accountsEvent = new MongoAccounts_1.AccountsEvent();
        accountsEvent._id = req.user.eventId;
        account._id = value;
        // 이벤트 참여 회원인지 체크
        const authQuery = yield serviceAuth.getAccountByIdEventId(account, accountsEvent);
        if (authQuery === null) {
            return Promise.reject('존재하지 않거나, 참여 회원이 아닙니다.');
        }
    }));
};
//# sourceMappingURL=validationCheck.js.map