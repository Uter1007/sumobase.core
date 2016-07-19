'use strict';

import {DomainController} from './../controllers/domainController';
import {BaseRouteProvider} from '../../../commons/base/baseRouteProvider';

export class DomainRouteProvider extends BaseRouteProvider {
    protected init() {
        this._domainController = new DomainController();
    }

    private _domainController: DomainController;

    constructor() {
        super();
    }

    protected setRoutes() {
        this.router.get('/api/domain/menu', this._domainController.getMenu);
    }
}
