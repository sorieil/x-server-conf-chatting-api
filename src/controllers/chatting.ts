import {
    Accounts,
    AccountsEvent,
} from './../entity/mongodb/main/MongoAccounts';
import { Event } from '../entity/mongodb/main/MongoEvent';

import { Request, Response } from 'express';
import { responseJson, RequestRole, tryCatch } from '../util/common';
import { validationResult, check, param, query, body } from 'express-validator';
import { checkTargetAccountIdEventIdExist } from '../util/validationCheck';

/**
 * 채팅 목록을 가져온다.
 */
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

            responseJson(res, [{ message: '채팅 목록' }], method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];
/**
 * 채팅을 보낸다.
 * 채팅을 보낼때는 서버를 통해서 보낸다.
 * TODO 조건: 유저의 마지먹 접속 디바이스를 조회 하고, 5분이 이상 api 통신 이력이 없는 경우, 모바일로 푸쉬를 보내준다.
 * 그리고 매번 메세지를 보낼때마다 접속 위치를 기록한다.
 */
const apiPost = [
    [checkTargetAccountIdEventIdExist.apply(this)],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            // Event
            const event = new Event();

            //Account
            const accounts = new Accounts();
            accounts._id = user._id;
            event._id = user.eventId;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            responseJson(
                res,
                [{ message: '메세지를 성공했습니다.' }],
                method,
                'success',
            );
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

// 사진 첨부하기..? 노노!!!
// const apiDeleteFavorite = [
//     async (req: Request, res: Response) => {
//         try {
//             const method: RequestRole = req.method.toString() as any;
//             const errors = validationResult(req);
//             const user = req.user as any;
//             const event = new Event();
//             event._id = user.eventId;

//             if (!errors.isEmpty()) {
//                 responseJson(res, errors.array(), method, 'invalid');
//                 return;
//             }

//             responseJson(res, [], method, 'success');
//         } catch (error) {
//             tryCatch(res, error);
//         }
//     },
// ];

export default {
    apiGet,
    apiPost,
};
