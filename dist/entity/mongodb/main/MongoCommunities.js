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
exports.Communities = exports.CommentSchema = exports.ReCommentSchema = exports.LikeSchema = void 0;
require("./Connect");
const MongoAccounts_1 = require("./MongoAccounts");
const MongoEvent_1 = require("./MongoEvent");
const mongoose_1 = __importStar(require("mongoose"));
const MongoCommonSchema_1 = require("./MongoCommonSchema");
exports.LikeSchema = new mongoose_1.Schema({
    accountId: { type: MongoAccounts_1.AccountsSchema },
    createDt: { type: Date },
});
exports.ReCommentSchema = new mongoose_1.Schema({
    eventId: { type: MongoEvent_1.EventSchema },
    accountId: { type: MongoAccounts_1.AccountsSchema },
    content: { type: String },
    createDt: { type: Date },
    reported: { type: [MongoCommonSchema_1.ReportSchema] },
    like: { type: [exports.LikeSchema] },
});
exports.CommentSchema = new mongoose_1.Schema({
    eventId: { type: MongoEvent_1.EventSchema },
    accountId: { type: MongoAccounts_1.AccountsSchema },
    content: { type: String },
    createDt: { type: Date },
    reported: { type: [MongoCommonSchema_1.ReportSchema] },
    reComment: { type: [exports.ReCommentSchema] },
    like: { type: Array },
});
const CommunitiesSchema = new mongoose_1.Schema({
    eventId: { type: mongoose_1.Schema.Types.ObjectId, createIndexes: true },
    accountId: { type: mongoose_1.Schema.Types.ObjectId, createIndexes: true },
    subject: { type: String },
    title: { type: String },
    body: { type: String },
    imageUrl: { type: String },
    createDt: { type: Date },
    order: { type: Number },
    tags: { type: Array },
    viewCount: { type: Number },
    likeCount: { type: Number },
    like: { type: [exports.LikeSchema] },
    comment: { type: [exports.CommentSchema] },
    reported: { type: [MongoCommonSchema_1.ReportSchema] },
    postPoint: { type: Number, default: 0 },
    likePoint: { type: Number, default: 0 },
    commentPoint: { type: Number, default: 0 },
});
exports.Communities = mongoose_1.default.model('communities', CommunitiesSchema);
//# sourceMappingURL=MongoCommunities.js.map