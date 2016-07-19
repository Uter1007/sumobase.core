'use strict';
import {healthCheck, me} from '../controllers/exampleCtrl';
import {helloWorld} from '../controllers/helloWorldCtrl';
import {SecureRouteProvider} from '../../../commons/base/secureRouteProvider';
import {BaseRouteProvider} from '../../../commons/base/baseRouteProvider';

export class HealthCheckRouteProvider extends BaseRouteProvider {
    protected init() {}

    protected setRoutes() {
        this.router.get('/', healthCheck);

        this.router.post('/helloworld', helloWorld);
    }
}

export class SecureHealthCheckRouteProvider extends SecureRouteProvider {
    protected init() {}

    protected setRoutes() {
        this.router.get('/me', me);
    }

}

