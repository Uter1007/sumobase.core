import * as express from 'express';

import BaseController from '../../commons/base/base.controller';

import { injectable, inject  } from 'inversify';
import { Controller, Get, Post } from 'inversify-express-utils';
import { ILogger } from '../../commons/logging/interfaces/logger.interface';
import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

import { UserService } from '../services/user.service';

import TYPES from '../../../constant/services.tags';
import {UserAlreadyInUseException} from '../../commons/error/models/user.alreadyinuse.exception';
import {UserValidator} from '../services/validator/user.validator.service';
import {RegisterParametersNotValid} from '../../commons/error/models/register.parameter.notvalid.exception';
import {PasswordValidator} from '../services/validator/password.validator.service';

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
                return await this._userService.create(user, clearTextPassword);
            }
        }
        throw new UserAlreadyInUseException('Error on register');
    }

    @Get('logout')
    public logout(request: express.Request, response: express.Response) {
        request.logout();
        response.redirect('/');
    }

    @Get('/settings', isLoggedIn)
    public async settings(): Promise<string> {
        return 'Home sweet home';
    }

    @Get('/')
    public async get(): Promise<string> {
        this._log.debug('This is a Test');
        this._log.info('This is a Test2');
        return 'Home';
    }
}
