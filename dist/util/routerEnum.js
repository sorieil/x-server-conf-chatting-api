"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description
 * 중복 라우팅을 방지 하고, 정렬을 위해서
 */
var RouterV1;
(function (RouterV1) {
    RouterV1["root"] = "/";
    RouterV1["home"] = "/api/v1/home";
    RouterV1["networking-participants-lists"] = "/api/v1/networking-participants-lists";
    RouterV1["networking-participants-favorite"] = "/api/v1/networking-participants-favorite";
    RouterV1["networking-chatting"] = "/api/v1/networking-chatting";
    RouterV1["networking-chatting-id"] = "/api/v1/networking-chatting/:chattingListId";
    RouterV1["networking-chatting-detail"] = "/api/v1/networking-chatting/:chattingListId/detail";
    RouterV1["networking-chatting-check-history"] = "/api/v1/networking-chatting-check-history/:targetAccountId";
})(RouterV1 = exports.RouterV1 || (exports.RouterV1 = {}));
//# sourceMappingURL=routerEnum.js.map