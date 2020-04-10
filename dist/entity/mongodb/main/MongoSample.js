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
exports.SampleSchema = new mongoose_1.Schema({
    name: { type: String },
    joinDt: { type: Date },
    accessDt: { type: Date },
    pushToken: { type: String },
    mobileType: { type: String },
    isPushOn: {
        type: Boolean,
        required: true,
    },
});
exports.Sample = mongoose_1.default.model('sample', exports.SampleSchema);
//# sourceMappingURL=MongoSample.js.map