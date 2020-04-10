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
const MongoAccounts_1 = require("../../entity/mongodb/main/MongoAccounts");
class ServiceAuth {
    constructor() { }
    getAccountById(accounts) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield MongoAccounts_1.Accounts.findById(accounts._id).lean();
            return query;
        });
    }
    getAccountByIdEventId(accounts, accountsEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(accounts, accountsEvent);
            const query = yield MongoAccounts_1.Accounts.findOne({
                _id: accounts._id,
                'eventList.eventId': accountsEvent._id,
            }).lean();
            return query;
        });
    }
}
exports.default = ServiceAuth;
//# sourceMappingURL=ServiceAuth.js.map