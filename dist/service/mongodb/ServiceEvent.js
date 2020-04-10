"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoEvent_1 = require("./../../entity/mongodb/main/MongoEvent");
class ServiceEvent {
    constructor() { }
    getEventPackageName(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            return MongoEvent_1.Event.find({ name: packageName }).lean();
        });
    }
    getEventById(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield MongoEvent_1.Event.findById(event._id).lean();
            return query;
        });
    }
}
exports.default = ServiceEvent;
//# sourceMappingURL=ServiceEvent.js.map