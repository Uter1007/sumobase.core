'use strict';
import {UserController} from './../controllers/userController';
import {BaseRouteProvider} from '../../../commons/base/baseRouteProvider';
import {SecureRouteProvider} from '../../../commons/base/secureRouteProvider';

export class UserRouteProvider extends BaseRouteProvider {
    private _userController: UserController;

    protected init() {
        this._userController = new UserController();
    }

    protected setRoutes() {
        this.router.post('/api/user/register', this._userController.register);
        this.router.post('/api/user/confirm', this._userController.confirm);
    }
}

export class UserSecureRouteProvider extends SecureRouteProvider {

    private _userController: UserController;

    protected init() {
        this._userController = new UserController();
    }

    protected  setRoutes() {
        this.router.get('/api/user/me', this._userController.me);
    }
}
