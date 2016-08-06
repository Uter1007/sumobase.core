import * as express from 'express';

import BaseController from '../../commons/base/base.controller';

import { injectable, inject  } from 'inversify';
import { Controller, Get, Post, Head, Put } from 'inversify-express-utils';
import { ILogger } from '../../commons/logging/interfaces/logger.interface';
import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

import { UserService } from '../services/user.service';

import TYPES from '../../../constant/services.tags';
import {UserAlreadyInUseException} from '../../commons/error/models/user.alreadyinuse.exception';
import {UserValidator} from '../services/validator/user.validator.service';
import {RegisterParametersNotValid} from '../../commons/error/models/register.parameter.notvalid.exception';
import {PasswordValidator} from '../services/validator/password.validator.service';

import * as moment from 'moment';
import {UserNotFoundException} from '../../commons/error/models/user.notfound.exception';

/* tslint:disable */
let isLoggedIn = require('../../commons/authenticate/middleware/request.authenticater');
/* tslint:enable */

@injectable()
@Controller('/api/v1.0/user')
export class UserController extends BaseController {

    private _log: ILogger;
    private _userService: UserService;

    constructor(@inject(TYPES.Logger) log: ILogger,
                @inject(TYPES.UserService) userService: UserService) {
        super();
        this._log = log;
        this._userService = userService;
    }

    /**
     * @api {post} /api/v1.0/user/register Register User
     * @apiName userRegister
     * @apiGroup User
     *
     * @apiParam {Object} registerRequest Express Body Request
     * @apiParam {String} registerRequest.firstName Firstname of the User
     * @apiParam {String} registerRequest.lastName Lastname of the User
     * @apiParam {String} registerRequest.email Email of the User
     * @apiParam {String} registerRequest.password Password of the User
     * @apiParam {String} registerRequest.confirmPassword Password Confirmation of the User
     *
     * @apiSuccess {Object} registerResponse Express Body Response
     * @apiSuccess {String} registerResponse.id Id of the User.
     * @apiSuccess {String} registerResponse.firstName Firstname of the User.
     * @apiSuccess {String} registerResponse.lastName  Lastname of the User.
     * @apiSuccess {String} registerResponse.email Email of the User.
     * @apiSuccess {String} registerResponse.modifiedOn ModifiedOn Date (UTC specified) of the User.
     * @apiSuccess {String} registerResponse.createdOn CreatedOn Date (UTC specified) of the User.
     *
     * @apiError RegisterParametersNotValid register parameters are not valid
     * @apiError UserAlreadyInUseException user already registered
     */
    @Post('/register')
    public async register(request: express.Request): Promise<User> {
        let user: IUser = User.createFromJSON(request.body);
        let founduser = await this._userService.findUserByName(user.email);
        if (!founduser) {
            let clearTextPassword: string = request.body.password;
            let clearTextConfirmPassword: string = request.body.confirmPassword;
            if (PasswordValidator.validatePassword(clearTextPassword, clearTextConfirmPassword)) {
                let validateErrors = UserValidator.validateUser(user);
                if (validateErrors.length > 0) {
                    throw new RegisterParametersNotValid('Validation error');
                }
                user.createdOn = moment().utc().toString();
                return await this._userService.create(user, clearTextPassword);
            }
        }
        throw new UserAlreadyInUseException('Error on register');
    }

    /**
     * @api {get} /api/v1.0/user/logout User Logout
     * @apiName userLogout
     * @apiGroup User
     *
     * @apiSuccess {Boolean} Success
     */
    @Get('/logout')
    public logout(request: express.Request) {
        request.logout();
        return true;
    }

    /**
     * @api {put} /api/v1.0/user/edit Edit User
     * @apiName userEdit
     * @apiGroup User
     *
     * @apiParam {Object} editRequest Express Body Request
     * @apiParam {String} editRequest.firstName Firstname of the User
     * @apiParam {String} editRequest.lastName Lastname of the User
     *
     * @apiSuccess {Object} editResponse Express Body Response
     * @apiSuccess {String} editResponse.id Id of the User.
     * @apiSuccess {String} editResponse.firstName Firstname of the User.
     * @apiSuccess {String} editResponse.lastName  Lastname of the User.
     * @apiSuccess {String} editResponse.email Email of the User.
     * @apiSuccess {String} editResponse.modifiedOn ModifiedOn Date (UTC specified) of the User.
     * @apiSuccess {String} editResponse.createdOn CreatedOn Date (UTC specified) of the User.
     *
     * @apiError RegisterParametersNotValid register parameters are not valid
     * @apiError UserAlreadyInUseException user already registered
     */
    @Put('/edit')
    public edit(request: express.Request) {

    }

    @Get('/notfound')
    public notfound(response: express.Response) {
        response.status(404);
        throw new UserNotFoundException('user can\'t be found');
    }

    @Head('/check')
    public async checkUserName(request: express.Request, response: express.Response, next) {
        let founduser = await this._userService.findUserByName(request.header('email'));
        if (founduser) {
            response.status(404);
        } else {
            response.status(200);
        }

        next();

    }

    @Get('/settings', isLoggedIn)
    public async settings(): Promise<string> {
        return 'Home sweet home';
    }

    @Get('/me', isLoggedIn)
    public async me(request: express.Request): Promise<string> {
        return request.user;
    }
}
