import express = require('express');
import {AuthenticationError} from '../../error/models/authentication.error';
import {injectable} from 'inversify';

@injectable()
export class AuthenticatorMiddleware {

    public static requestAuthenticater: express.RequestHandler = (request: express.Request,
                                                                  response: express.Response,
                                                                  next: express.NextFunction) => {
        if (request.isAuthenticated()) {
            return next();
        }

        next(new AuthenticationError('Not LoggedIn'));
    };
}

export default AuthenticatorMiddleware;
