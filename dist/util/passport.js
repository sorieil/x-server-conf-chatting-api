"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const MongoAccounts_1 = require("./../entity/mongodb/main/MongoAccounts");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const logger_1 = __importDefault(require("./logger"));
const chalk_1 = __importDefault(require("chalk"));
const ServiceAuth_1 = __importDefault(require("../service/mongodb/ServiceAuth"));
const responsePrint = (res) => {
    console.log('-----------------\n');
    console.log('Request body-----* \n', res.req.body);
    console.log('>>>>>>>>>>>>>>>>>', res.req.originalUrl);
};
exports.auth = (secretName) => {
    const opts = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: secretName,
        algorithms: ['HS256'],
    };
    passport_1.default.use(secretName, new passport_jwt_1.Strategy(opts, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const serviceAccount = new ServiceAuth_1.default();
            const level = jwtPayload.level;
            console.log(`[JWT PAYLOAD]\n>>>>>>>>>>>> Log Start >>>>>>>>>>>> \n`, jwtPayload);
            // 이벤트 아이디가 있어야지만 이용 할 수 있다.
            if (typeof jwtPayload.eventId === 'undefined') {
                console.log('No eventId');
                // 토큰에 이벤트 아이디가 없으면, 사용을 할 수 없다.
                return done('noEventId', null);
            }
            // 토큰의 상태가 유저인지 관리자인지 체크 한다.
            // 관리자 모드와, 앱/웹 모드를 구분 짓는다.
            if (level === 'eUser') {
                const accounts = new MongoAccounts_1.Accounts();
                accounts._id = jwtPayload._id;
                const user = serviceAccount.getAccountById(accounts);
                return user
                    .then(userResult => {
                    // console.log('user result:', userResult);
                    if (userResult) {
                        // 유저는 존재 하고, 이벤트 체크가 필요한경우 여기에...
                        const userInfo = Object.assign({}, userResult, {
                            eventId: jwtPayload.eventId,
                        });
                        return done(undefined, userInfo);
                    }
                    else {
                        return done('noEventId', null);
                    }
                })
                    .catch(error => {
                    console.log('passport error:', error);
                    return done('dbError', null);
                });
            }
            else if (level === 'eAdmin') {
                // True
                // return done(undefined, {넣고 싶은것});
                // False
                return done(undefined, null);
            }
            else {
                return done(undefined, null);
            }
        }
        catch (error) {
            console.log('Passport: ', chalk_1.default.red(error));
            return done(undefined, undefined);
        }
    })));
    // };
    passport_1.default.serializeUser((user, done) => {
        logger_1.default.info('serializeUser: ', user);
        done(undefined, user.id);
    });
    passport_1.default.deserializeUser((id, done) => {
        logger_1.default.info('deserializeUser: ', id);
        done(undefined, id);
    });
    const isAuthenticate = (req, res, next) => {
        passport_1.default.authenticate(secretName, { session: false }, (err, user, info) => {
            if (err === 'dbError') {
                responsePrint(res);
                res.status(500).json({
                    resCode: 500,
                    message: '관리자에게 문의해주세요.',
                });
                return;
            }
            // 이벤트 아이디가 없으면, 정지
            if (err === 'noEventId') {
                responsePrint(res);
                res.status(401).json({
                    resCode: 401,
                    message: 'No allow token. It is not event token.',
                });
                return;
            }
            if (typeof user === 'undefined' || user === null || !user) {
                responsePrint(res);
                res.status(403).json({
                    resCode: 403,
                    message: 'Members only.',
                });
                return;
            }
            // 정상 토큰이 아닙니다.
            if (typeof info !== 'undefined') {
                responsePrint(res);
                res.status(401).json({
                    resCode: 401,
                    message: 'No auth token',
                });
                return;
            }
            else {
                // Pass through
                // req.user = user;
                // 여기에서 login 으로 할 수 있는데 login 은 express 의 내부 함수이기도 해서 user 로 했다.
                // 그리서 req 로 불러 올때  req.user.users[0] or req.user.admin[0] 이런식으로 사용해야 한다.
                // console.log('============= :', user);
                Object.assign(req, { user: user });
                // 맨 마지막에 실행 되게 하기 위해서
                setTimeout(() => {
                    next();
                }, 0);
            }
        })(req, res, next);
    };
    return {
        isAuthenticate,
    };
};
//# sourceMappingURL=passport.js.map