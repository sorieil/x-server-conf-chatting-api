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
const MongoEvent_1 = require("./MongoEvent");
const MongoCommonSchema_1 = require("./MongoCommonSchema");
exports.LikeSchema = new mongoose_1.Schema({
    accountId: { type: MongoAccounts_1.AccountsSchema },
    createDt: Date,
});
exports.reCommentSchema = new mongoose_1.Schema({
    eventId: { type: MongoEvent_1.EventSchema },
    accountId: { type: MongoAccounts_1.AccountsSchema },
    content: { type: String },
    createDt: { type: String },
    reported: { type: MongoCommonSchema_1.ReportSchema },
    like: { type: exports.LikeSchema },
});
exports.CommentSchema = new mongoose_1.Schema({
    eventId: { type: MongoEvent_1.EventSchema },
    accountId: { type: MongoAccounts_1.AccountsSchema },
    content: { type: mongoose_1.Schema.Types.ObjectId },
    createDt: { type: Date },
    reported: { type: mongoose_1.Schema.Types.ObjectId },
    reComment: { type: mongoose_1.Schema.Types.ObjectId },
    like: { type: mongoose_1.Schema.Types.ObjectId },
});
exports.FeatureSchema = new mongoose_1.Schema({
    featureId: mongoose_1.default.Schema.Types.ObjectId,
    featureType: String,
    featureTypeName: String,
    featureSessionId: mongoose_1.default.Schema.Types.ObjectId,
    featureTitle: String,
    featureThumbnailUrl: String,
    order: Number,
}, { _id: false });
const ScheduleSchema = new mongoose_1.Schema({
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    sessionId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    order: Number,
    name: String,
    description: String,
    location: String,
    tags: Array,
    createDt: Date,
    startDt: Date,
    endDt: Date,
    timezone: String,
    isCurrentSchedule: Boolean,
    imageUrl: String,
    connectFeature: { type: Array },
    bookmark: { type: Array },
    comment: { type: Array },
    isBookmark: { type: Boolean },
});
exports.Schedule = mongoose_1.default.model('schedule', ScheduleSchema);
//# sourceMappingURL=MongoSchedule.js.map