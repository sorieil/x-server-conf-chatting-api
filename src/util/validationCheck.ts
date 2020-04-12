import {
    ChattingLists,
    ChattingListsI,
} from './../entity/mongodb/main/MongoChattingLists';
import { body, param } from 'express-validator';
import ServiceAuth from '../service/mongodb/ServiceAuth';
import { Accounts, AccountsEvent } from '../entity/mongodb/main/MongoAccounts';
import ServiceChatting from '../service/mongodb/ServiceChatting';

/**
 * 이벤트 아이디와, 조회를 하려는 회원이 해당 이벤트에 참여한 회원인지 체크 한다.
 * @targetAccountId 찾고자 하는 회원의 아이디 값.
 * @eventId 토큰 기준으로 이벤트 아이디를 가져온다.
 * @return req.body.targetAccountId
 */
export const checkTargetAccountIdAndEventIdExist = () => {
    return body('targetAccountId').custom(async (value, { req }) => {
        const serviceAuth = new ServiceAuth();
        const accounts = new Accounts();
        const accountsEvent = new AccountsEvent();
        accountsEvent._id = req.user.eventId;
        accounts._id = value;

        // 이벤트 참여 회원인지 체크
        const authQuery = await serviceAuth.getAccountByIdEventId(
            accounts,
            accountsEvent,
        );

        if (authQuery === null) {
            return Promise.reject('존재하지 않거나, 참여 회원이 아닙니다.');
        }
    });
};

/**
 * 채팅의 맴버조회에 있어서 해당 채팅에 맴버인지 체크
 * @chattingListId 찾고자 하는 채팅방의 고유키
 * @returns 조회한 채팅정보 배열타입으로 출력합니다.
 */
export const checkJoinedChattingMember = () => {
    return param('chattingListId').custom(async (value, { req }) => {
        const serviceChatting = new ServiceChatting();
        const accounts = new Accounts();
        const chattingLists = new ChattingLists();
        accounts._id = req.user._id;
        chattingLists._id = value;
        const queryChattingLists = await serviceChatting.getChattingMemberDetailById(
            chattingLists,
            accounts,
        );
        console.log('query chatting lists:', queryChattingLists);
        if (queryChattingLists.length === 0) {
            return Promise.reject(
                '존재하지 않은 채팅방이거나, 참여 회원이 아닙니다.',
            );
        } else {
            // 이게 공용으로 사용할껀데.. 흠.. 아니다.구조적으로 상위에서 검사를 하는게 맞다.
            // 더 좋은 구조가 생각나면 그때 변경하기로~
            return Promise.resolve(
                Object.assign(req.user, { chattingLists: queryChattingLists }),
            );
        }
    });
};
