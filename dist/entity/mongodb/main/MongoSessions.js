"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sessions = exports.SessionsSchema = exports.joinAccountSchema = exports.clearQuestSchema = void 0;
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