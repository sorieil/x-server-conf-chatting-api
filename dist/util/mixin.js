"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileNameWithTime = void 0;
const uuidv4_1 = __importDefault(require("uuidv4"));
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
/*
    시간 기준으로 파일명을 생성해준다.
*/
exports.generateFileNameWithTime = (fileName) => {
    const time = moment_1.default()
        .format('YYYYMMDDHHmmssSSSZZ')
        .replace(/(\+|-)/gi, '_');
    const uuid = uuidv4_1.default().replace(/-/gi, '');
    const extname = path_1.default.extname(fileName);
    return `${time}_${uuid}${extname}`;
};
// const;
//# sourceMappingURL=mixin.js.map