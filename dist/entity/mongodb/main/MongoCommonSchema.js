"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSchema = void 0;
const mongoose_1 = require("mongoose");
const MongoAccounts_1 = require("./MongoAccounts");
exports.ReportSchema = new mongoose_1.Schema({
    accountId: { type: MongoAccounts_1.AccountsSchema },
    createDt: { type: Date },
    reason: { type: String },
});
//# sourceMappingURL=MongoCommonSchema.js.map