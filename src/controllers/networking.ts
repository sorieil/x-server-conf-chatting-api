import { ParticipantsAccounts } from './../entity/mongodb/main/MongoParticipantsFavorite';
import {
    Accounts,
    AccountsEvent,
} from './../entity/mongodb/main/MongoAccounts';
import { Event } from '../entity/mongodb/main/MongoEvent';

import { Request, Response } from 'express';
import { responseJson, RequestRole, tryCatch } from '../util/common';
import { validationResult, body } from 'express-validator';
import ServiceNetworking from '../service/mongodb/ServiceNetworking';
import { checkTargetAccountIdEventIdExist } from '../util/validationCheck';

const apiGet = [
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const accountsEvent = new AccountsEvent();
            const accounts = new Accounts();
            accounts._id = user._id;
            accountsEvent._id = user.eventId;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            const serviceAccounts = new ServiceNetworking();
            const queryJoinEventList = await serviceAccounts.getEventParticipantsLists(
                accounts,
                accountsEvent,
            );

            responseJson(res, queryJoinEventList, method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

/**
 * 참여 회원중 중요한 사람을 즐겨찾기 추가를 한다.
 */
const apiPostFavorite = [
    [checkTargetAccountIdEventIdExist.apply(this)],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            // Event
            const event = new Event();
            event._id = user.eventId;

            //Account
            const accounts = new Accounts();
            accounts._id = user._id;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            // Target Accounts
            const targetAccounts = new Accounts();
            targetAccounts._id = req.body.targetAccountId;

            const serviceNetworking = new ServiceNetworking();
            const query = await serviceNetworking.saveParticipantsFavorite(
                targetAccounts,
                accounts,
                event,
            );

            responseJson(res, [query], method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

/**
 * 즐겨찾기한 회원을 삭제 한다.
 */
const apiDeleteFavorite = [
    [body('favoriteId').isString()],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            // Event
            const event = new Event();
            event._id = user.eventId;

            //Account
            const accounts = new Accounts();
            accounts._id = user._id;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            const favorite = new ParticipantsAccounts();
            favorite._id = req.body.favoriteId;

            const serviceNetworking = new ServiceNetworking();
            const query = await serviceNetworking.deleteParticipantsFavorite(
                accounts,
                favorite,
                event,
            );
            responseJson(res, [query], method, 'delete');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

export default {
    apiGet,
    apiPostFavorite,
    apiDeleteFavorite,
};
