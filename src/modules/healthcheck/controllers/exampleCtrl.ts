import {Request, Response} from 'express';

/**
 * Example controller that provides a healthcheck endpoint
 */
namespace Example {
    'use strict';

    /*
     * Return an empty 200 response
     */
    export function healthCheck(req: Request, res: Response) {
        res.end();
    }

    export function me(req: Request, res: Response) {
        res.end();
    }
}

export = Example;
