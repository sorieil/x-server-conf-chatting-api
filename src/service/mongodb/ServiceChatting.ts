import { ChattingListsI } from './../../entity/mongodb/main/MongoChattingLists';
import {
    MessageI,
    ChattingMessages,
} from './../../entity/mongodb/main/MongoChattingMessages';
import {
    ChattingLists,
    MembersInChattingLists,
    MembersI,
} from './../../entity/mongodb/main/MongoChattingLists';
import { EventI } from '../../entity/mongodb/main/MongoEvent';
import { Accounts, AccountsI } from '../../entity/mongodb/main/MongoAccounts';
import { firebaseAdmin } from '../../util/firebase';
export default class ServiceChatting {
    constructor() {}

    public async getChattingListByIdEventId(
        accounts: AccountsI,
        event: EventI,
    ): Promise<any> {
        const query = await ChattingLists.find({
            eventId: event._id,
            members: { $in: [accounts._id] },
        }).exec();

        return query;
    }

    // 대화가 처음인지 아닌지 체크
    public async checkInitChattingHistory(
        accounts: AccountsI,
        targetAccounts: AccountsI,
    ) {
        const query = ChattingLists.find({
            members: { $all: [accounts._id, targetAccounts._id] },
        }).exec();

        return query;
    }

    /**
     *
     * @param accounts 메세지를 입력한 회원의 정보
     */
    async batchMember(accounts: AccountsI): Promise<any> {
        const saveMember = new MembersInChattingLists();
        saveMember._id = accounts._id;
        saveMember.name =
            typeof accounts.name === 'undefined' ? 'Null Name' : accounts.name;
        if (typeof accounts.profiles !== 'undefined') {
            saveMember.companyName =
                typeof accounts.profiles.companyName === 'undefined'
                    ? 'Null Company'
                    : accounts.profiles.companyName;
            saveMember.departmentName =
                typeof accounts.profiles.departmentName === 'undefined'
                    ? 'Null Department Name'
                    : accounts.profiles.departmentName;
        }

        return saveMember;
    }

    /**
     * 채팅 아이디가 없는 경우 사용하는 함수,
     * 채팅이 처음인경우 시작하는 함수
     * @param accounts 입력하는 사람의 정보
     * @param targetAccounts 채팅 대상
     * @param event 어떤 이벤트에서 채팅하는지
     * @param message 보내고자 하는 메세지
     */
    public async postSendMessage(
        accounts: AccountsI,
        targetAccounts: AccountsI,
        event: EventI,
        message: string,
    ): Promise<any> {
        const chattingLists = new ChattingLists();
        // 기존 채팅 내역이 있는지 체크 한다.
        const beforeChatting: ChattingListsI[] = await this.checkInitChattingHistory(
            accounts,
            targetAccounts,
        );

        console.log('회원 아아디로 채팅 아이디 찾기:', beforeChatting);

        /*
        1. 혹시 모를 데이터 무결성을 위해서 대화맴버 기준으로
           채팅을 조회 한다.
           
        2. 채팅의 상태를 업데이트 해준다.
           만약 없다면, 메세지를 입력하고나서
           채팅 list 를 생성을 해준다.

        3. 대화 참여회원 등록 (각 회원의 정보를 조회 해서 데이터를 넣어준다.)
           만약 대화 기록이 없다면, 대화를 초기화 해준다. 여기에서 맴버의 변화가 거의 없기 떄문에
           모든 데이터를 할때마다 해줄 필요는 없다.
        */

        // 채팅을 처음 생성할때...
        if (beforeChatting.length === 0) {
            // 타겟의 아이디로 정보를 조회해온다.
            const queryTargetAccounts: AccountsI = await Accounts.findById(
                targetAccounts._id,
            ).lean();

            // 맵버 지정
            const memberBucket: MembersI[] = [];
            memberBucket.push(await this.batchMember(accounts));
            memberBucket.push(await this.batchMember(queryTargetAccounts));

            console.log('채팅 맴버 등록:', memberBucket);

            // 채팅방 생성
            const saveChattingList = new ChattingLists();
            saveChattingList.lastText = message;
            saveChattingList.createdAt = new Date();
            saveChattingList.members = [accounts._id, targetAccounts._id];
            saveChattingList.membersInformation = memberBucket;
            saveChattingList.eventId = event._id;
            saveChattingList.status = true;
            const initChattingList = await saveChattingList.save();

            // 채팅내용 저장
            const saveChattingMessage = new ChattingMessages();
            saveChattingMessage.accountId = accounts._id;
            saveChattingMessage.createdAt = new Date();
            saveChattingMessage.messages = message;
            saveChattingMessage.fileupload = [];
            saveChattingMessage.chattingListId = initChattingList._id;

            const query = await saveChattingMessage.save();

            await firebaseAdmin
                .firestore()
                .collection('chatting')
                .doc(initChattingList._id.toString()) // chatting id
                .collection('messages')
                .doc(query._id.toString())
                .set({
                    message: message,
                    accountId: accounts._id.toString(),
                    createdAt: new Date(),
                });

            return query;
        } else {
            // 기존의 채팅에 업데이트를 해준다.
            // 채팅방 생성
            const chattingList = new ChattingLists();
            chattingList.lastText = message;
            chattingList.updatedAt = new Date();

            // 채팅 상태 업데이트
            await ChattingLists.updateOne(
                { id: beforeChatting[0]._id },
                { $set: chattingList },
            );

            // 채팅내용 저장
            const saveChattingMessage = new ChattingMessages();
            saveChattingMessage.accountId = accounts._id;
            saveChattingMessage.createdAt = new Date();
            saveChattingMessage.messages = message;
            saveChattingMessage.fileupload = [];
            saveChattingMessage.chattingListId = beforeChatting[0]._id;

            const query = await saveChattingMessage.save();
            console.log('chatting message id:', query);
            await firebaseAdmin
                .firestore()
                .collection('chatting')
                .doc(beforeChatting[0]._id.toString()) // chatting id
                .collection('messages')
                .doc(query._id.toString())
                .set({
                    message: message,
                    accountId: accounts._id.toString(),
                    createdAt: new Date(),
                });

            return query;
        }
    }

    public async postSendMessageById(
        accounts: AccountsI,
        chattingLists: ChattingListsI,
        message: string,
    ): Promise<any> {
        const chattingList = new ChattingLists();
        chattingList.lastText = message;
        chattingList.updatedAt = new Date();

        // 채팅 상태 업데이트
        await ChattingLists.updateOne(
            { id: chattingLists._id },
            { $set: chattingList },
        );

        // 채팅내용 저장
        const saveChattingMessage = new ChattingMessages();
        saveChattingMessage.accountId = accounts._id;
        saveChattingMessage.createdAt = new Date();
        saveChattingMessage.messages = message;
        saveChattingMessage.fileupload = [];
        saveChattingMessage.chattingListId = chattingLists._id;

        const query = await saveChattingMessage.save();
        console.log('chatting message id:', query);
        await firebaseAdmin
            .firestore()
            .collection('chatting')
            .doc(chattingLists._id.toString()) // chatting id
            .collection('messages')
            .doc(query._id.toString())
            .set({
                message: message,
                accountId: accounts._id.toString(),
                createdAt: new Date(),
            });

        return query;
    }

    public async checkChattingListIdExist(
        chattingList: ChattingListsI,
    ): Promise<any> {
        const query = ChattingLists.findById(chattingList._id).lean();
        return query;
    }
}
