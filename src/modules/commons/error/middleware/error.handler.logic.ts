import express = require('express');
import {BaseException} from '../../base/base.exception';

let errorHandler = (
    err: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {

    let errorcode = (<any>err).statusCode;
    if (err instanceof BaseException) {
        response.sendStatus(errorcode || 555);
    } else if (errorcode === 413) {
        response.send(err);
    } else if (response.statusCode === 404) {
        response.sendStatus(404);
    } else if (err.name === 'UnauthorizedError') {
        response.sendStatus(401);
    } else {
        response.sendStatus(555);
    }
};

export = errorHandler;
