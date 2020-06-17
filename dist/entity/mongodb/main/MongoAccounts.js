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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accounts = exports.AccountsSchema = exports.AccountsEvent = exports.profile = void 0;
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