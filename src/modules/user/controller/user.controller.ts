import { Controller, Get, Post } from 'inversify-express-utils';
import { injectable, inject  } from 'inversify';
import * as express from 'express';
import BaseController from '../../commons/base/base.controller';
import {ILogger} from '../../commons/logging/interfaces/logger.interface';
import TYPES from '../../../constant/services.tags';
import UserService from '../services/user.service';
import {User} from '../models/user.model';
import {IUser} from '../interfaces/user.interface';
import {Deserialize} from 'cerialize';
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

        let user: IUser =  Deserialize(request.body, User);

        let founduser = await this._userService.findUserByNameAsync(user.email);

        if (!founduser) {
            let clearTextPassword: string = request.body.password;
            return await this._userService.createAsync(user, clearTextPassword);
        }

        throw new Error('Error on register');

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
