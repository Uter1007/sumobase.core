import {HookableRouter} from '../helpers/router.hookable';

import * as configFile from '../../config/env/config';
import * as expressJwt from 'express-jwt';
import {BaseRouteProvider} from './base.route.provider';

const authenticate = expressJwt({secret : configFile.TestConfig.token.secret});

export abstract class SecureRouteProvider extends BaseRouteProvider {

    public router: any; // next time we will extend Router instead of Wrapping Helper Methods

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
