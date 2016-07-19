import * as passport from 'passport';
import {AuthController} from '../controllers/authController';
import {BaseRouteProvider} from '../../../commons/base/baseRouteProvider';

export class AuthRouteProvider extends BaseRouteProvider {

    private _authController: AuthController;

    constructor() {
        super();
    }

    protected init() {
        this._authController = new AuthController();
    }

    protected setRoutes() {
        this.router.post(
            '/api/token',
            this._authController.validateRefreshToken,
            this._authController.generateAccessToken,
            this._authController.respondToken
        );

        this.router.post(
            '/api/token/reject',
            this._authController.rejectToken,
            this._authController.respondReject
        );

        this.router.post(
            '/api/auth',
            passport.authenticate('local', {session: false}),
            this._authController.serialize,
            this._authController.generateAccessToken,
            this._authController.generateRefreshToken,
            this._authController.respondAuth
        );
    }
}
