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
require("reflect-metadata");
require("./util/secrets");
const routerEnum_1 = require("./util/routerEnum");
const common_1 = require("./util/common");
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const passport_2 = require("./util/passport");
const helmet = require("helmet");
const cors = require("cors");
const db_1 = require("./util/db");
const chalk_1 = __importDefault(require("chalk"));
const chatting_1 = __importDefault(require("./controllers/chatting"));
db_1.connections(process.env)
    .then((connect) => __awaiter(void 0, void 0, void 0, function* () {
    // Create Express server
    const app = express_1.default();
    // Express configuration
    app.set('port', process.env.PORT);
    // Cross browsing free open.
    app.use(cors({
        origin: '*',
        optionsSuccessStatus: 200,
    }));
    // Traffic compress.
    app.use(compression_1.default());
    // Auto convert body parse
    app.use(body_parser_1.default.json({ limit: '50mb' }));
    app.use(body_parser_1.default.urlencoded({
        limit: '50mb',
        extended: true,
    }));
    // Default secure guard
    app.use(helmet());
    app.use(passport_1.default.initialize());
    /**
     * Primary app routes.
     */
    // Admin Route
    const authCheck = passport_2.auth('xsync-user').isAuthenticate;
    // app.get(RouterRole['/api/v1/sample'], ...admin.apiGet);
    app.get(routerEnum_1.RouterV1['root'], (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        common_1.responseJson(res, [{ message: `start` }], 'GET', 'success');
    }));
    // 채팅 리스트
    app.get(routerEnum_1.RouterV1['networking-chatting'], authCheck, ...chatting_1.default.apiGet);
    // 채팅방 정보
    app.get(routerEnum_1.RouterV1['networking-chatting-detail'], authCheck, ...chatting_1.default.apiGetDetail);
    app.get(routerEnum_1.RouterV1['networking-chatting-notReadCount'], authCheck, ...chatting_1.default.apiGetNotReadCount);
    app.get(routerEnum_1.RouterV1['networking-chatting-check-history'], authCheck, ...chatting_1.default.apiGetCheckChatHistory);
    app.post(routerEnum_1.RouterV1['networking-chatting-readStatusChange'], authCheck, ...chatting_1.default.apiReadStatusChange);
    // 채팅 시작 및 메세지 보내기
    app.post(routerEnum_1.RouterV1['networking-chatting'], authCheck, ...chatting_1.default.apiPost);
    // 채팅방 아이디로 메세지 보내기
    app.post(routerEnum_1.RouterV1['networking-chatting-id'], authCheck, ...chatting_1.default.apiPostMessage);
    /**s
     * Error Handler. Provides full stack - remove for production
     */
    if (process.env.NODE_ENV !== 'production') {
        app.use(errorhandler_1.default());
    }
    /**
     * Start Express server.
     */
    app.use((err, req, res, next) => {
        // The error id is attached to `res.sentry` to be returned
        // and optionally displayed to the user for support.
        const method = req.method.toString();
        common_1.responseJson(res, [res.sentry], method, 'invalid');
    });
    process.on('SIGINT', () => {
        console.log('Received SIGINT. Press Control-D to exit.');
    });
    app.listen(app.get('port'), () => {
        console.clear();
        console.log(`  App is running at http://${process.env.HOST}:${app.get('port')} in ${process.env.NODE_ENV} mode',`);
        console.log(chalk_1.default.red('Press CTRL-C to stop\n'));
    });
}))
    .catch((error) => {
    console.log('Typeorm database connection error...?d', error);
    process.exit(1);
    // logger.error(chalk.red('DB connection error', error));
});
//# sourceMappingURL=app.js.map