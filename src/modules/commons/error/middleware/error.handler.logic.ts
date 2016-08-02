import express = require('express');
import {BaseException} from '../../base/base.exception';

let errorHandler = (
    err: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {
    if (err instanceof BaseException) {
        response.sendStatus(err.statusCode || 555);
    } else if (response.statusCode === 404) {
        response.sendStatus(404);
    } else if (err.name === 'UnauthorizedError') {
        response.sendStatus(401);
    } else {
        response.sendStatus(555);
    }
};

export = errorHandler;
