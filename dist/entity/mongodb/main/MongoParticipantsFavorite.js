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