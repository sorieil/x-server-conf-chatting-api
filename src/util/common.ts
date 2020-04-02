import { Response } from 'express';
import logger from './logger';
import { isArray } from 'util';
export type RequestRole = 'POST' | 'GET' | 'PATCH' | 'DELETE';
type ResponseRole = 'success' | 'invalid' | 'delete' | 'fails';
export const responseRole = {
    POST: {
        success: 201,
        error: 409,
        errorMessage: 'Already exists data.',
    },
    GET: {
        success: 200,
        error: 200,
        errorMessage: 'No Content',
    },
    PATCH: {
        success: 201,
        error: 200,
        errorMessage: 'Failed to update the request.',
    },
    DELETE: {
        success: 204,
        error: 200,
        errorMessage: 'Failed to delete the request.',
    },
};
export const responseJson = (
    res: Response,
    data: any[],
    requestType: RequestRole,
    responseType: ResponseRole,
): void => {
    console.log('-----------------\n');
    console.log('Request body-----* \n', res.req.body);
    console.log(
        `<<<<<<<<<<<<< Log End <<<<<<<<<<<< URL => [${requestType}:${responseType}:${res.req.originalUrl}]`,
    );
    if (responseType === 'success') {
        if (data.length > 0 && isArray(data)) {
            const code = responseRole[requestType].success;
            res.status(code).json({
                resCode: code,
                message: 'Success',
                result: data,
            });
        } else {
            const message = responseRole[requestType].errorMessage;
            const code = responseRole[requestType].error;
            res.status(code).json({
                resCode: code,
                message: message,
                result: [],
            });
        }
    } else if (responseType === 'delete') {
        if (data.length > 0) {
            const code = responseRole[requestType].success;
            res.status(201).json({
                resCode: 201,
                message: `Delete successful`,
                result: data,
            });
        } else {
            const code = responseRole[requestType].error;
            const message = responseRole[requestType].errorMessage;
            res.status(code).json({
                resCode: code,
                message: message,
                result: [],
            });
        }
    } else {
        res.status(400).json({
            resCode: 400,
            message: data,
        });
    }
};

export const tryCatch = (res: Response, error: any): Response => {
    if (process.env.NODE_ENV === 'production') {
        const request = require('request');

        const headers = {
            'Content-type': 'application/json',
        };
        const user = res.req.user as any;
        const errorMessage = ` id: ${user._id} \n eventId: ${user.eventId} \n name: ${user.name}`;
        const dataString = `{"text":"${error} \n ${res.req.originalUrl} \n${errorMessage}"}`;
        const options = {
            url:
                'https://hooks.slack.com/services/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',
            method: 'POST',
            headers: headers,
            body: dataString,
        };

        function callback(errors: any, response: any, body: any) {
            if (!errors && response.statusCode == 200) {
                console.log(body);
            }
        }

        request(options, callback);
    }

    logger.error('try catch error: ' + error);

    // getManager('mysqlDB').connection.close();
    console.log('-----------------\n');
    // if (typeof res.req.user.business !== undefined) {
    // console.log('Business id: ', typeof res.req.user.business);
    // }
    console.log('Request body-----* \n', res.req.body);
    // console.log('Response body-----* \n', data);
    console.log(
        `<<<<<<<<<<<<< Log End <<<<<<<<<<<< URL => [${res.req.originalUrl}]`,
    );
    return res.status(500).json({
        resCode: 500,
        message: 'Server error',
    });
};
