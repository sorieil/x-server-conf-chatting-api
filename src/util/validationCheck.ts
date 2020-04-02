import { body } from 'express-validator';
import ServiceAuth from '../service/mongodb/ServiceAuth';
import { Accounts, AccountsEvent } from '../entity/mongodb/main/MongoAccounts';

/**
 * 이벤트 아이디와, 조회를 하려는 회원이 해당 이벤트에 참여한 회원인지 체크 한다.
 * @targetAccountId 찾고자 하는 회원의 아이디 값.
 * @eventId 토큰 기준으로 이벤트 아이디를 가져온다.
 * @return req.body.targetAccountId
 */
export const checkTargetAccountIdEventIdExist = () => {
    return body('targetAccountId').custom(async (value, { req }) => {
        const serviceAuth = new ServiceAuth();
        const account = new Accounts();
        const accountsEvent = new AccountsEvent();
        accountsEvent._id = req.user.eventId;
        account._id = value;

        // 이벤트 참여 회원인지 체크
        const authQuery = await serviceAuth.getAccountByIdEventId(
            account,
            accountsEvent,
        );

        if (authQuery === null) {
            return Promise.reject('존재하지 않거나, 참여 회원이 아닙니다.');
        }
    });
};
