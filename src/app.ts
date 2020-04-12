import 'reflect-metadata';
import('./util/secrets');
import { RouterV1 } from './util/routerEnum';
import { responseJson, RequestRole } from './util/common';
import bodyParser from 'body-parser';
import compression from 'compression'; // compresses requests
import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import errorHandler from 'errorhandler';
import { auth } from './util/passport';
import helmet = require('helmet');
import cors = require('cors');
import { connections } from './util/db';
import chalk from 'chalk';
import chatting from './controllers/chatting';

connections(process.env)
    .then(async (connect: any) => {
        // Create Express server

        const app = express();
        // Express configuration
        app.set('port', process.env.PORT);

        // Cross browsing free open.
        app.use(
            cors({
                origin: '*',
                optionsSuccessStatus: 200,
            }),
        );

        // Traffic compress.
        app.use(compression());

        // Auto convert body parse
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(
            bodyParser.urlencoded({
                limit: '50mb',
                extended: true,
            }),
        );
        // Default secure guard
        app.use(helmet());
        app.use(passport.initialize());

        /**
         * Primary app routes.
         */

        // Admin Route
        const authCheck = auth('xsync-user').isAuthenticate;

        // app.get(RouterRole['/api/v1/sample'], ...admin.apiGet);
        app.get(RouterV1['root'], async (_req: Request, res: Response) => {
            responseJson(res, [{ message: `start` }], 'GET', 'success');
        });

        // 채팅 리스트
        app.get(RouterV1['networking-chatting'], authCheck, ...chatting.apiGet);

        // 채팅방 정보
        app.get(
            RouterV1['networking-chatting-detail'],
            authCheck,
            ...chatting.apiGetDetail,
        );

        // 채팅 시작 및 메세지 보내기
        app.post(
            RouterV1['networking-chatting'],
            authCheck,
            ...chatting.apiPost,
        );

        // 채팅방 아이디로 메세지 보내기
        app.post(
            RouterV1['networking-chatting-id'],
            authCheck,
            ...chatting.apiPostMessage,
        );

        /**s
         * Error Handler. Provides full stack - remove for production
         */
        if (process.env.NODE_ENV !== 'production') {
            app.use(errorHandler());
        }

        /**
         * Start Express server.
         */
        app.use(
            (
                err: any,
                req: Request,
                res: Response | any,
                next: NextFunction,
            ) => {
                // The error id is attached to `res.sentry` to be returned
                // and optionally displayed to the user for support.
                const method: RequestRole = req.method.toString() as RequestRole;
                responseJson(res, [res.sentry], method, 'invalid');
            },
        );

        process.on('SIGINT', () => {
            console.log('Received SIGINT. Press Control-D to exit.');
        });

        app.listen(app.get('port'), () => {
            console.clear();
            console.log(
                `  App is running at http://${process.env.HOST}:${app.get(
                    'port',
                )} in ${process.env.NODE_ENV} mode',`,
            );
            console.log(chalk.red('Press CTRL-C to stop\n'));
        });
    })
    .catch((error: any) => {
        console.log('Typeorm database connection error...?d', error);
        process.exit(1);
        // logger.error(chalk.red('DB connection error', error));
    });
