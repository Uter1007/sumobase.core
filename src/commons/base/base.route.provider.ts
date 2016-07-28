import {Router} from 'express';
import {BaseClass} from './base.class';

export abstract class BaseRouteProvider extends BaseClass {

    public router: Router;
    public apiVersion: string;
    public apiRoutePrefix: string;

    constructor() {
        super();
        this.apiRoutePrefix = 'api';
        this.apiVersion = 'v1';
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
