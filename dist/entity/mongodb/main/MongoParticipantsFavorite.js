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
exports.ParticipantsFavorite = exports.ParticipantsFavoriteSchema = exports.ParticipantsAccounts = void 0;
require("./Connect");
const mongoose_1 = __importStar(require("mongoose"));
const ParticipantsAccountsSchema = new mongoose_1.Schema({
    accountId: { type: mongoose_1.Schema.Types.ObjectId },
    createDt: { type: Date },
});
exports.ParticipantsAccounts = mongoose_1.model('ParticipantsAccounts', ParticipantsAccountsSchema);
exports.ParticipantsFavoriteSchema = new mongoose_1.Schema({
    accountId: { type: mongoose_1.Schema.Types.ObjectId },
    eventId: { type: mongoose_1.Schema.Types.ObjectId },
    favoriteAccounts: { type: [ParticipantsAccountsSchema] },
    createDt: { type: Date },
});
exports.ParticipantsFavorite = mongoose_1.default.model('participantsFavorite', exports.ParticipantsFavoriteSchema);
//# sourceMappingURL=MongoParticipantsFavorite.js.map