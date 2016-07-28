import {Request, Response} from 'express';
import {BaseException} from '../base/base.exception';

namespace ErrorHandler {

    'use strict';

    /**
     * Generates a 500 response
     */

    let handler = (err: Error | BaseException,
                   req: Request,
                   res: Response,
                   next: Function,
                   includeStackTrace: boolean) => {

        // logger.log(LogLevel.ERROR, '' + err);
        console.log(err);
        if (err instanceof BaseException) {
            res.sendStatus(err.statusCode || 555);
        } else if (res.statusCode === 404) {
            res.sendStatus(404);
        } else if (err.name === 'UnauthorizedError') {
            res.sendStatus(401);
        } else {
            res.sendStatus(555);
        }
    };

    /**
     * 500 error development response
     */
    export function development(err: Error,
                                req: Request,
                                res: Response,
                                next: Function) {
        return handler(err, req, res, next, true);
    }

    /**
     * 500 error production response
     */
    export function production(err: Error,
                               req: Request,
                               res: Response,
                               next: Function) {
        return handler(err, req, res, next, false);
    }

}

export = ErrorHandler;
