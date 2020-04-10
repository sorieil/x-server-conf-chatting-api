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
exports.ChattingListsSchema = new mongoose_1.Schema({
    lastText: { type: String },
    lastTextCreatedAt: { type: Date },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    members: { type: Array },
    membersInformation: { type: [exports.MemberSchema] },
    status: { type: Boolean },
    chattingMessageId: { type: mongoose_1.Schema.Types.ObjectId },
    eventId: { type: mongoose_1.Schema.Types.ObjectId },
});
exports.ChattingLists = mongoose_1.default.model('chattingLists', exports.ChattingListsSchema);
//# sourceMappingURL=MongoChattingLists.js.map