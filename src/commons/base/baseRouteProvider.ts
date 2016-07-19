import {Router} from 'express';
import {BaseClass} from './baseClass';

export abstract class BaseRouteProvider extends BaseClass {

    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.init();
        this.setRoutes();
    }

    protected abstract init();

    protected abstract setRoutes();

    public getRouter() {
        return this.router;
    }
}
