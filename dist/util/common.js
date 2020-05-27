"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryCatch = exports.responseJson = exports.responseRole = void 0;
const logger_1 = __importDefault(require("./logger"));
const util_1 = require("util");
exports.responseRole = {
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
exports.responseJson = (res, data, requestType, responseType) => {
    console.log('-----------------\n');
    console.log('Request body-----* \n', res.req.body);
    console.log(`<<<<<<<<<<<<< Log End <<<<<<<<<<<< URL => [${requestType}:${responseType}:${res.req.originalUrl}]`);
    if (responseType === 'success') {
        if (data.length > 0 && util_1.isArray(data)) {
            const code = exports.responseRole[requestType].success;
            res.status(code).json({
                resCode: code,
                message: 'Success',
                result: data,
            });
        }
        else {
            const message = exports.responseRole[requestType].errorMessage;
            const code = exports.responseRole[requestType].error;
            res.status(code).json({
                resCode: code,
                message: message,
                result: [],
            });
        }
    }
    else if (responseType === 'delete') {
        if (data.length > 0) {
            const code = exports.responseRole[requestType].success;
            res.status(201).json({
                resCode: 201,
                message: `Delete successful`,
                result: data,
            });
        }
        else {
            const code = exports.responseRole[requestType].error;
            const message = exports.responseRole[requestType].errorMessage;
            res.status(code).json({
                resCode: code,
                message: message,
                result: [],
            });
        }
    }
    else {
        res.status(400).json({
            resCode: 400,
            message: data,
        });
    }
};
exports.tryCatch = (res, error) => {
    // Slack에 에러 실시간 리포트
    if (process.env.NODE_ENV === 'production') {
        const request = require('request');
        const headers = {
            'Content-type': 'application/json',
        };
        const user = res.req.user;
        const errorMessage = ` id: ${user._id} \n eventId: ${user.eventId} \n name: ${user.name}`;
        const dataString = `{"text":"${error} \n ${res.req.originalUrl} \n${errorMessage} \n ${res.req.body}"}`;
        const options = {
            url: 'https://hooks.slack.com/services/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',
            method: 'POST',
            headers: headers,
            body: dataString,
        };
        function callback(errors, response, body) {
            if (!errors && response.statusCode == 200) {
                console.log(body);
            }
        }
        request(options, callback);
    }
    logger_1.default.error('try catch error: ' + error);
    // getManager('mysqlDB').connection.close();
    console.log('-----------------\n');
    // if (typeof res.req.user.business !== undefined) {
    // console.log('Business id: ', typeof res.req.user.business);
    // }
    console.log('Request body-----* \n', res.req.body);
    // console.log('Response body-----* \n', data);
    console.log(`<<<<<<<<<<<<< Log End <<<<<<<<<<<< URL => [${res.req.originalUrl}]`);
    return res.status(500).json({
        resCode: 500,
        message: 'Server error',
    });
};
//# sourceMappingURL=common.js.map