"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./Connect");
const MongoAccounts_1 = require("./MongoAccounts");
const mongoose_1 = __importStar(require("mongoose"));
exports.clearQuestSchema = new mongoose_1.Schema({
    questId: mongoose_1.Schema.Types.ObjectId,
    order: Number,
}, { _id: false });
exports.joinAccountSchema = new mongoose_1.Schema({
    accountId: { type: MongoAccounts_1.AccountsSchema },
    joinDt: Date,
    isReceivedProduct: Boolean,
    // Quest
    clearQuest: { type: exports.clearQuestSchema },
    // Stamp
    stampCount: Number,
    // Quiz Score
    score: Number,
    rank: Number,
    timeDiff: Number,
    // luckyDraw
    luckyDraw: Number,
});
exports.SessionsSchema = new mongoose_1.Schema({
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    sessionType: {
        type: String,
    },
    menuId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    title: { type: Number },
    createDt: { type: Date },
    joinAccount: { type: [MongoAccounts_1.AccountsSchema] },
    likePoint: { type: Number, default: 0 },
    commentPoint: { type: Number, default: 0 },
    getLikePoint: { type: Number, default: 0 },
    getCommentPoint: { type: Number, default: 0 },
    point: { type: Number, default: 0 },
    maxProductCount: { type: Number },
    remainedProductCount: { type: Number },
    isOpen: { type: Boolean },
    closeUrl: { type: String },
    limitUserCount: { type: Number },
    description: { type: String },
    subject: { type: Array },
    // Quiz Survival Accounts
    aliveUser: { type: [MongoAccounts_1.AccountsSchema] },
    // Accounts
    deadUser: { type: [MongoAccounts_1.AccountsSchema] },
    order: { type: Number },
    // Survey
    isDupParticipation: {
        type: Boolean,
        default: false,
    },
    // Quest
    isSequential: {
        type: Boolean,
        default: true,
    },
    // LuckyDraw
    luckyDrawJoinCode: { type: String },
    winLuckyDraw: { type: Array },
    isDupWinLuckyDraw: {
        type: Boolean,
        default: false,
    },
    // UserParticipation
    userParticipationType: {
        type: String,
    },
});
exports.Sessions = mongoose_1.default.model('sessions', exports.SessionsSchema);
//# sourceMappingURL=MongoSessions.js.map