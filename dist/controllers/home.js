"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoEvent_1 = require("./../entity/mongodb/main/MongoEvent");
const common_1 = require("../util/common");
const express_validator_1 = require("express-validator");
const ServiceEvent_1 = __importDefault(require("../service/mongodb/ServiceEvent"));
const ServiceCommunities_1 = __importDefault(require("../service/mongodb/ServiceCommunities"));
const ServiceSchedule_1 = __importDefault(require("../service/mongodb/ServiceSchedule"));
const moment = require("moment");
const apiGet = [
    [
        express_validator_1.query('date').custom((value, { req }) => {
            console.log('date:', value);
            const dateValid = moment(value).format('YYYY-MM-DD');
            console.log('dateValid', dateValid);
            return dateValid;
        }),
    ],
    (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const method = req.method.toString();
            const errors = express_validator_1.validationResult(req);
            const user = req.user;
            const event = new MongoEvent_1.Event();
            event._id = user.eventId;
            if (!errors.isEmpty()) {
                common_1.responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const searchDate = req.query.date;
            const serviceEvent = new ServiceEvent_1.default();
            const serviceCommunities = new ServiceCommunities_1.default();
            const serviceSchedule = new ServiceSchedule_1.default();
            const queryEvent = yield serviceEvent.getEventById(event);
            const queryCommunities = yield serviceCommunities.getCommunitiesByEvenId(event);
            const querySchedule = yield serviceSchedule.getScheduleByEventId(event, searchDate, queryEvent.timezone);
            console.log('querySchedule:', querySchedule);
            common_1.responseJson(res, [
                {
                    default: queryEvent,
                    communities: queryCommunities,
                    schedule: querySchedule,
                    notice: false,
                },
            ], method, 'success');
        }
        catch (error) {
            common_1.tryCatch(res, error);
        }
    }),
];
exports.default = {
    apiGet,
};
//# sourceMappingURL=home.js.map