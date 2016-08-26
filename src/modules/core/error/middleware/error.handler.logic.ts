import express = require('express');
import {BaseException} from '../../base/base.exception';

let errorHandler = (
    err: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {

    let code: number = (<any>err).statusCode;
    let message: string = (<any>err).message;
    let errorcode = (<any>err).statusCode;
    response.contentType('application/json');
    if (err instanceof BaseException) {
        code = errorcode || 555;
        message = err.message || 'Unknown Exception';
    } else if (errorcode === 413) {
        response.send(err);
    } else if (response.statusCode === 404) {
        code = 404;
        message = 'Not Found';
    } else if (err.name === 'UnauthorizedError') {
        code = 401;
        message = 'Unauthorized';
    } else {
        code = 555;
        message = 'Unknown Exception';
    }

    response.status(code).send(JSON.stringify(message));
};

export = errorHandler;
