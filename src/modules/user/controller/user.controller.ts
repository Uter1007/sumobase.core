import { Controller, Get } from 'inversify-express-utils';
import { injectable, inject  } from 'inversify';
import isLoggedIn = require('../../commons/authenticate/middleware/request.authenticater');
import BaseController from '../../commons/base/base.controller';
import {ILogger} from '../../commons/logging/interfaces/logger.interface';
import TYPES from '../../../constant/services.tags';

@injectable()
@Controller('/api/v1.0/user')
export class UserController extends BaseController {

    private _log: ILogger;

    constructor(@inject(TYPES.Logger) log: ILogger) {
        super();
        this._log = log;
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
