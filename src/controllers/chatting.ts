import { ChattingLists } from './../entity/mongodb/main/MongoChattingLists';
import { _MessageSchemaInChattingMessage } from './../entity/mongodb/main/MongoChattingMessages';
import { Accounts } from './../entity/mongodb/main/MongoAccounts';
import { Event } from '../entity/mongodb/main/MongoEvent';

import { Request, Response } from 'express';
import { responseJson, RequestRole, tryCatch } from '../util/common';
import { validationResult, check, param, query, body } from 'express-validator';
import { checkTargetAccountIdEventIdExist } from '../util/validationCheck';
import ServiceChatting from '../service/mongodb/ServiceChatting';

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
            const query = await serviceChatting.getChattingListByIdEventId(
                accounts,
                event,
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
        checkTargetAccountIdEventIdExist.apply(this),
        body('targetAccountId')
            .not()
            .isEmpty()
            .isString(),
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
};
