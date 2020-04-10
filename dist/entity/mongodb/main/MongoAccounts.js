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
const ProfileSchema = new mongoose_1.Schema({
    profileImg: { type: String },
    profileImgThumb: { type: String },
    email: { type: String },
    companyName: { type: String },
    departmentName: { type: String },
    address: { type: String },
    nickname: { type: String },
    age: { type: String },
    nationality: { type: String },
    boyfriend: { type: String },
    gender: { type: String },
    favorite: { type: String },
    Species: { type: String },
    Class: { type: String },
    birthday: { type: String },
});
exports.profile = mongoose_1.model('profile', ProfileSchema);
const AccountsEventSchema = new mongoose_1.Schema({
    eventId: { type: mongoose_1.Schema.Types.ObjectId },
    name: { type: String },
    joinDt: { type: Date },
    accessDt: { type: Date },
    pushToken: { type: String },
    mobileType: { type: String },
    isPushOn: { type: Boolean },
    point: { type: Number },
});
exports.AccountsEvent = mongoose_1.model('eventList', AccountsEventSchema);
exports.AccountsSchema = new mongoose_1.Schema({
    block: { type: Array, required: true },
    group: { type: Array },
    phone: { type: String, required: true },
    password: { type: String },
    name: { type: String },
    eventList: { type: [AccountsEventSchema] },
    profiles: { type: ProfileSchema },
    myQRCode: { type: String },
    isDupPhoneNum: {
        type: Boolean,
        required: true,
    },
    isInactive: {
        type: Boolean,
        required: true,
    },
    permission: { type: Array },
});
exports.Accounts = mongoose_1.default.model('Accounts', exports.AccountsSchema);
//# sourceMappingURL=MongoAccounts.js.map