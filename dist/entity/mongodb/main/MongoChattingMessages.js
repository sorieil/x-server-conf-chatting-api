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
exports.MessageSchema = new mongoose_1.Schema({
    accountId: { type: mongoose_1.Schema.Types.ObjectId },
    message: { type: String },
    createdAt: { type: Date },
});
exports._MessageSchemaInChattingMessage = mongoose_1.model('message', exports.MessageSchema);
exports.ChattingMessagesSchema = new mongoose_1.Schema({
    accountId: { type: mongoose_1.Schema.Types.ObjectId },
    chattingListId: { type: mongoose_1.Schema.Types.ObjectId },
    messages: { type: String },
    fileupload: { type: Array },
    createdAt: { type: Date },
});
exports.ChattingMessages = mongoose_1.default.model('chattingMessages', exports.ChattingMessagesSchema);
//# sourceMappingURL=MongoChattingMessages.js.map