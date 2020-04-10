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