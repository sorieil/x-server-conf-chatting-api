"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoParticipantsFavorite_1 = require("./../entity/mongodb/main/MongoParticipantsFavorite");
const MongoAccounts_1 = require("./../entity/mongodb/main/MongoAccounts");
const MongoEvent_1 = require("../entity/mongodb/main/MongoEvent");
const common_1 = require("../util/common");
const express_validator_1 = require("express-validator");
const ServiceNetworking_1 = __importDefault(require("../service/mongodb/ServiceNetworking"));
const validationCheck_1 = require("../util/validationCheck");
const apiGet = [
    (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            const accountsEvent = new MongoAccounts_1.AccountsEvent();
            const accounts = new MongoAccounts_1.Accounts();
            accounts._id = user._id;
            accountsEvent._id = user.eventId;
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const serviceAccounts = new ServiceNetworking_1.default();
            const queryJoinEventList = yield serviceAccounts.getEventParticipantsLists(accounts, accountsEvent);
            common_1.responseJson(res, queryJoinEventList, method, 'success');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
/**
 * 참여 회원중 중요한 사람을 즐겨찾기 추가를 한다.
 */
const apiPostFavorite = [
    [validationCheck_1.checkTargetAccountIdEventIdExist.apply(this)],
    (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            // Event
            const event = new MongoEvent_1.Event();
            event._id = user.eventId;
            //Account
            const accounts = new MongoAccounts_1.Accounts();
            accounts._id = user._id;
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            // Target Accounts
            const targetAccounts = new MongoAccounts_1.Accounts();
            targetAccounts._id = req.body.targetAccountId;
            const serviceNetworking = new ServiceNetworking_1.default();
            const query = yield serviceNetworking.saveParticipantsFavorite(targetAccounts, accounts, event);
            common_1.responseJson(res, [query], method, 'success');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
/**
 * 즐겨찾기한 회원을 삭제 한다.
 */
const apiDeleteFavorite = [
    [express_validator_1.body('favoriteId').isString()],
    (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            // Event
            const event = new MongoEvent_1.Event();
            event._id = user.eventId;
            //Account
            const accounts = new MongoAccounts_1.Accounts();
            accounts._id = user._id;
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const favorite = new MongoParticipantsFavorite_1.ParticipantsAccounts();
            favorite._id = req.body.favoriteId;
            const serviceNetworking = new ServiceNetworking_1.default();
            const query = yield serviceNetworking.deleteParticipantsFavorite(accounts, favorite, event);
            common_1.responseJson(res, [query], method, 'delete');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
exports.default = {
    apiGet,
    apiPostFavorite,
    apiDeleteFavorite,
};
//# sourceMappingURL=networking.js.map