import {BaseClass} from './baseClass';
import {HookableRouter} from '../helpers/hookableRouter';

import * as configFile from '../../config/env/config';
import * as expressJwt from 'express-jwt';

const authenticate = expressJwt({secret : configFile.TestConfig.token.secret});

export abstract class SecureRouteProvider extends BaseClass {

    public router: any;

    constructor() {
        super();
        this.router = new HookableRouter( authenticate );
        this.init();
        this.setRoutes();
    }

    protected abstract init();

    protected abstract setRoutes();

    public getRouter() {
        return this.router.getHookedRouter();
    }
}
