import { checkJoinedChattingMember } from './../util/validationCheck';
import { ChattingLists } from './../entity/mongodb/main/MongoChattingLists';
import { _MessageSchemaInChattingMessage } from './../entity/mongodb/main/MongoChattingMessages';
import { Accounts } from './../entity/mongodb/main/MongoAccounts';
import { Event } from '../entity/mongodb/main/MongoEvent';

import { Request, Response } from 'express';
import { responseJson, RequestRole, tryCatch } from '../util/common';
import { validationResult, check, param, query, body } from 'express-validator';
import { checkTargetAccountIdAndEventIdExist } from '../util/validationCheck';
import ServiceChatting from '../service/mongodb/ServiceChatting';
import { resolve } from 'bluebird';

/**
 * 채팅 목록을 가져온다.
 */
const apiGet = [
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const event = new Event();
            const accounts = new Accounts();
            accounts._id = user._id;
            event._id = user.eventId;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            const serviceChatting = new ServiceChatting();
            const query: any[] = await serviceChatting.getChattingListByIdEventId(
                accounts,
                event,
            );

            const convertQuery: any[] = await new Promise(resolve => {
                for (let i = 0; i < query.length; i++) {
                    const row = query[i];
                    for (let m = 0; m < row.membersInformation.length; m++) {
                        const user = row.membersInformation[m];
                        if (user._id.toString() === accounts._id.toString()) {
                            // delete row.membersInformation[m];
                            row.membersInformation.splice(m, 1);
                        }

                        delete user._id;
                    }
                }

                resolve(query);
            });

            // const queryFilter = query.map(v => {
            //     v.membersInformation = v.membersInformation.filter(
            //         (m: any) => m._id.toString() !== user._id.toString(),
            //     );

            //     return v;
            // });

            responseJson(res, convertQuery, method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

/**
 * 채팅 목록의 자세한 정보를 가져온다.
 */
const apiGetDetail = [
    [checkJoinedChattingMember.apply(this)],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const accounts = new Accounts();
            accounts._id = user._id;

            // 정보는 위 권한 메서드에서 처리 합니다.
            // 결과 값음 req.chattingLists 로 출력 할 수 있습니다.

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            // 요청자의 정보와, 다른 맴버를 분리 합니다.
            const chattingLists = user.chattingLists as any;
            responseJson(res, chattingLists, method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

/**
 * 선택한 회원과 채팅 이 존재 하는지 체크 한다.
 */
const apiGetCheckChatHistory = [
    [
        param('targetAccountId')
            .not()
            .isEmpty(),
    ],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const accounts = new Accounts();
            const targetAccounts = new Accounts();
            targetAccounts._id = req.params.targetAccountId;
            accounts._id = user._id;

            // 정보는 위 권한 메서드에서 처리 합니다.
            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            const service = new ServiceChatting();
            const query = await service.checkInitChattingHistory(
                accounts,
                targetAccounts,
            );

            responseJson(res, query, method, 'success');
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
    [
        checkTargetAccountIdAndEventIdExist.apply(this),
        body('message')
            .not()
            .isEmpty()
            .isString(),
    ],
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

            const targetAccounts = new Accounts();
            const message = req.body.message;
            const serviceChatting = new ServiceChatting();

            targetAccounts._id = req.body.targetAccountId;

            const query = await serviceChatting.postSendMessage(
                accounts,
                targetAccounts,
                event,
                message,
            );
            responseJson(res, [query], method, 'success');
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

/**
 * 메세지만 전달
 */
const apiPostMessage = [
    [
        body('message')
            .not()
            .isEmpty()
            .isString(),
    ],
    async (req: Request, res: Response) => {
        try {
            const method: RequestRole = req.method.toString() as any;
            const errors = validationResult(req);
            const user = req.user as any;
            const accounts = new Accounts();
            accounts._id = user._id;

            if (!errors.isEmpty()) {
                responseJson(res, errors.array(), method, 'invalid');
                return;
            }

            const message = req.body.message;
            const serviceChatting = new ServiceChatting();
            const chattingLists = new ChattingLists();
            chattingLists._id = req.params.chattingListId;
            const queryChattingListId = await serviceChatting.checkChattingListIdExist(
                chattingLists,
            );

            if (queryChattingListId) {
                const query = await serviceChatting.postSendMessageById(
                    accounts,
                    chattingLists,
                    message,
                );
                responseJson(res, [query], method, 'success');
            } else {
                responseJson(
                    res,
                    [{ message: '존재하지 않는 채팅입니다.' }],
                    method,
                    'fails',
                );
            }
            // 바로 메세지를 보낸다.
            // 실제로 존재하는 chattingListId 인지 체크 한다. (내부 로직에서 처리한다.)
        } catch (error) {
            tryCatch(res, error);
        }
    },
];

export default {
    apiGet,
    apiPost,
    apiPostMessage,
    apiGetDetail,
    apiGetCheckChatHistory,
};
