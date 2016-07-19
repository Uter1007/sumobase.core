import {Request, Response} from 'express';

namespace HelloWorld {
    'use strict';

    export function helloWorld(req: Request, res: Response) {
        res.json({ hello: 'world' });
        res.end();
    }
}

export = HelloWorld;
