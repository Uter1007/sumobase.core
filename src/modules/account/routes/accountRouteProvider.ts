'use strict';

import {AccountController} from './../controllers/accountController';
import {BaseRouteProvider} from '../../../commons/base/baseRouteProvider';

export class AccountRouteProvider extends BaseRouteProvider {
    protected init() {
        this._accountController = new AccountController();
    }

    private _accountController: AccountController;

    constructor() {
        super();
    }

    protected setRoutes() {
        this.router.post('/api/accounts/check', this._accountController.checkAccountName);
        this.router.post('/api/accounts/create', this._accountController.createAccount);
    }
}
