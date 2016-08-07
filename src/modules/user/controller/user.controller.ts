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
import {ValidationException} from '../../commons/error/models/validation.exception';
import {PasswordValidator} from '../services/validator/password.validator.service';
import * as moment from 'moment';
import {UserNotFoundException} from '../../commons/error/models/user.notfound.exception';

import * as passport from 'passport';

/* tslint:disable */
let isLoggedIn = require('../../commons/authenticate/middleware/request.authenticater');
/* tslint:enable */

@injectable()
@Controller('/api/user')
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
     * @api {post} /api/user/register Register User
     * @apiVersion 1.0.0
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
     * @apiError ValidationException register parameters are not valid
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
                    throw new ValidationException('User validation failed');
                }
                user.createdOn = moment().utc().toString();
                return await this._userService.create(user, clearTextPassword);
            }
        }
        throw new UserAlreadyInUseException('Error on register');
    }

    /**
     * @api {post} /api/user/login User Login
     * @apiVersion 1.0.0
     * @apiName userLogin
     * @apiGroup User
     *
     * @apiSuccess Redirect to /api/user/me
     * @apiError Redirect to /api/user/notfound
     */
    @Post('/login', passport.authenticate('local', {
        failureRedirect : '/api/user/notfound',
        successRedirect : '/api/user/me'
    }))

    /**
     * @api {get} /api/user/logout User Logout
     * @apiVersion 1.0.0
     * @apiName userLogout
     * @apiGroup User
     *
     * @apiSuccess {Boolean} Success
     */
    @Get('/logout', isLoggedIn)
    public logout(request: express.Request) {
        request.logout();
        return true;
    }

    /**
     * @api {put} /api/user/edit Edit User
     * @apiVersion 1.0.0
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
     * @apiError ValidationException register parameters are not valid
     * @apiError UserAlreadyInUseException user already registered
     */
    @Put('/edit', isLoggedIn)
    public async edit(request: express.Request) {
        let user = request.user;

        if (request.body && request.body.firstName) {
            user.firstName = request.body.firstName;
        }

        if (request.body && request.body.lastName) {
            user.lastName = request.body.lastName;
        }

        let validateErrors = UserValidator.validateUser(user);
        if (validateErrors.length > 0) {
            throw new ValidationException('User validation failed');
        }

        let updateduser = await this._userService.update(user);
        return updateduser;
    }

    /**
     * @api {put} /api/user/changepw Change Password
     * @apiVersion 1.0.0
     * @apiName changePassword
     * @apiGroup User
     *
     * @apiParam {Object} changePasswordRequest Express Body Request
     * @apiParam {String} changePasswordRequest.firstName Firstname of the User
     * @apiParam {String} changePasswordRequest.lastName Lastname of the User
     *
     * @apiSuccess {Boolean} change Pw was ok
     *
     * @apiError ValidationException parameters are not valid
     * @apiError UnkownException change Password failed
     */
    @Put('/changepw', isLoggedIn)
    public async changepw(request: express.Request) {
        let user = request.user;
        let clearTextPassword: string = request.body.password;
        let clearTextConfirmPassword: string = request.body.confirmPassword;
        if (PasswordValidator.validatePassword(clearTextPassword, clearTextConfirmPassword)) {
            return await this._userService.updatePassword(user.id, clearTextPassword);
        }
    }

    /**
     * @api {head} /api/user/check Check if Email is already in use
     * @apiVersion 1.0.0
     * @apiName checkUserName
     * @apiGroup User
     *
     * @apiSuccess (200)  UserName doesn't exist
     * @apiSuccess (404)  UserName already in use
     */
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

    /**
     * @api {get} /api/user/me Register User
     * @apiVersion 1.0.0
     * @apiName userMe
     * @apiGroup User
     *
     * @apiSuccess {Object} userResponse Express Body Response
     * @apiSuccess {String} userResponse.id Id of the User.
     * @apiSuccess {String} userResponse.firstName Firstname of the User.
     * @apiSuccess {String} userResponse.lastName  Lastname of the User.
     * @apiSuccess {String} userResponse.email Email of the User.
     * @apiSuccess {String} userResponse.modifiedOn ModifiedOn Date (UTC specified) of the User.
     * @apiSuccess {String} userResponse.createdOn CreatedOn Date (UTC specified) of the User.
     *
     * @apiError ValidationException register parameters are not valid
     * @apiError UserAlreadyInUseException user already registered
     */
    @Get('/me', isLoggedIn)
    public async me(request: express.Request): Promise<string> {
        return request.user;
    }

    // routes that may not be needed

    @Get('/settings', isLoggedIn)
    public async settings(): Promise<string> {
        return 'Home sweet home';
    }

    @Get('/notfound')
    public notfound() {
        throw new UserNotFoundException('user can\'t be found');
    }
}
