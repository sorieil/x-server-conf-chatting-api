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
exports.ControlFeaturesSchema = new mongoose_1.Schema({
    chat: { type: Boolean },
    myQR: { type: Boolean },
    notiBox: { type: Boolean },
});
exports.EventSchema = new mongoose_1.Schema({
    name: { type: String },
    joinDt: { type: Date },
    accessDt: { type: Date },
    pushToken: { type: String },
    mobileType: { type: String },
    isPushOn: {
        type: Boolean,
        required: true,
    },
    point: {
        type: Boolean,
        required: true,
        default: 0,
    },
    lang: { type: Array, default: 'kr' },
    order: { type: Number },
    createDt: { type: Date },
    type: { type: String },
    containerId: { type: mongoose_1.Schema.Types.ObjectId },
    packageName: { type: String },
    accessType: { type: String },
    privateCode: { type: String },
    nameTagAccessCode: { type: String },
    max: { type: Number },
    eventUpdateVersion: { type: Number },
    timezone: { type: String },
    isPublish: { type: Boolean },
    isPublic: { type: Boolean },
    thumbnailUrl: { type: String },
    step: { type: Number },
    controlFeatures: { type: exports.ControlFeaturesSchema },
    directUrl: { type: String },
});
exports.Event = mongoose_1.default.model('event', exports.EventSchema);
//# sourceMappingURL=MongoEvent.js.map