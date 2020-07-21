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
exports.ChattingMessages = exports.ChattingMessagesSchema = exports.ReadMembersSchema = exports._MessageSchemaInChattingMessage = exports.MessageSchema = void 0;
require("./Connect");
const mongoose_1 = __importStar(require("mongoose"));
exports.MessageSchema = new mongoose_1.Schema({
    accountId: { type: mongoose_1.Schema.Types.ObjectId },
    message: { type: String },
    createdAt: { type: Date },
});
exports._MessageSchemaInChattingMessage = mongoose_1.model('message', exports.MessageSchema);
exports.ReadMembersSchema = new mongoose_1.Schema({
    accountId: mongoose_1.Schema.Types.ObjectId,
    readDate: Date,
});
exports.ChattingMessagesSchema = new mongoose_1.Schema({
    accountId: { type: mongoose_1.Schema.Types.ObjectId },
    chattingListId: { type: mongoose_1.Schema.Types.ObjectId },
    messages: { type: String },
    fileupload: { type: Array },
    createdAt: { type: Date },
    readMembers: { type: Array },
    image: { type: String },
    type: { type: String },
    imageSize: { type: Number },
});
exports.ChattingMessages = mongoose_1.default.model('chattingMessages', exports.ChattingMessagesSchema);
//# sourceMappingURL=MongoChattingMessages.js.map