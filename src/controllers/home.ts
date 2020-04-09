import { Event } from './../entity/mongodb/main/MongoEvent';
import { Types } from 'mongoose';
import { Request, Response } from 'express';
import { responseJson, RequestRole, tryCatch } from '../util/common';
import { validationResult, check, param, query } from 'express-validator';
import ServiceEvent from '../service/mongodb/ServiceEvent';
import ServiceCommunities from '../service/mongodb/ServiceCommunities';
import ServiceSchedule from '../service/mongodb/ServiceSchedule';
import moment = require('moment');

const apiGet = [
    [
        query('date').custom((value, { req }) => {
            console.log('date:', value);
            const dateValid = moment(value).format('YYYY-MM-DD');
            console.log('dateValid', dateValid);
            return dateValid;
        }),
    ],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const event = new Event();
            event._id = user.eventId;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }
            const searchDate: string = req.query.date as any;
            const serviceEvent = new ServiceEvent();
            const serviceCommunities = new ServiceCommunities();
            const serviceSchedule = new ServiceSchedule();
            const queryEvent = await serviceEvent.getEventById(event);
            const queryCommunities = await serviceCommunities.getCommunitiesByEvenId(
                event,
            );

            const querySchedule = await serviceSchedule.getScheduleByEventId(
                event,
                searchDate,
                queryEvent.timezone,
            );

            console.log('querySchedule:', querySchedule);

            responseJson(
                res,
                [
                    {
                        default: queryEvent,
                        communities: queryCommunities,
                        schedule: querySchedule,
                        notice: false,
                    },
                ],
                method,
                'success',
            );
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

export default {
    apiGet,
};
