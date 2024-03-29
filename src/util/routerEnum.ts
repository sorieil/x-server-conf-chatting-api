/**
 * @description
 * 중복 라우팅을 방지 하고, 정렬을 위해서
 */
export enum RouterV1 {
    'root' = '/',
    'home' = '/api/v1/home',
    'networking-participants-lists' = '/api/v1/networking-participants-lists',
    'networking-participants-favorite' = '/api/v1/networking-participants-favorite',
    'networking-chatting' = '/api/v1/networking-chatting',
    'networking-chatting-notReadCount' = '/api/v1/networking-chatting/notReadCount',
    'networking-chatting-readStatusChange' = '/api/v1/networking-chatting/:chattingListId/readStatusChange',
    'networking-chatting-id' = '/api/v1/networking-chatting/:chattingListId',
    'networking-chatting-detail' = '/api/v1/networking-chatting/:chattingListId/detail',
    'networking-chatting-check-history' = '/api/v1/networking-chatting-check-history/:targetAccountId',
    'networking-chatting-push-test' = '/api/v1/test',
}
