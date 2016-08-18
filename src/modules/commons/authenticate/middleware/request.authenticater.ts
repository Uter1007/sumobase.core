import express = require('express');
import {AuthenticationError} from '../../error/models/authentication.error';

let requestAuthenticater: express.RequestHandler = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {
    if (request.isAuthenticated()) {
        return next();
    }

    next(new AuthenticationError('Not LoggedIn'));
};

export = requestAuthenticater;
