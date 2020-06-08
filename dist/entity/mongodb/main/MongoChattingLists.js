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
exports.ChattingLists = exports.ChattingListsSchema = exports.LastMsgInfoSchema = exports.MembersInChattingLists = exports.MemberSchema = void 0;
require("./Connect");
const mongoose_1 = __importStar(require("mongoose"));
exports.MemberSchema = new mongoose_1.Schema({
    accountId: { type: mongoose_1.Schema.Types.ObjectId },
    profileImage: { type: String },
    name: { type: String },
    companyName: { type: String },
    departmentName: { type: String },
    notReadCount: { type: Number },
});
exports.MembersInChattingLists = mongoose_1.model('members', exports.MemberSchema);
exports.LastMsgInfoSchema = new mongoose_1.Schema({
    accountId: { type: mongoose_1.Schema.Types.ObjectId },
    createdAt: { type: Date },
    messages: { type: String },
    chattingListId: { type: mongoose_1.Schema.Types.ObjectId },
});
exports.ChattingListsSchema = new mongoose_1.Schema({
    lastText: { type: String },
    lastTextCreatedAt: { type: Date },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    members: { type: Array },
    membersInformation: { type: [exports.MemberSchema] },
    status: { type: Boolean },
    chattingMessageId: { type: mongoose_1.Schema.Types.ObjectId },
    eventId: { type: [mongoose_1.Schema.Types.ObjectId] },
    notReadCount: { type: Number },
});
exports.ChattingLists = mongoose_1.default.model('chattingLists', exports.ChattingListsSchema);
//# sourceMappingURL=MongoChattingLists.js.map