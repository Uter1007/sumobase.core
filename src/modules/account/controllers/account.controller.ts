import {BaseController} from '../../../commons/base/base.controller';
import {AccountService} from '../logic/account.service';
import {Request, Response} from 'express';
import {
    AccountCheckInvalid,
} from '../../../commons/errors/models/user.mgmt.exceptions';

import * as Promise from 'bluebird';
import {accountModel, AccountState} from '../models/account.model';
import {LogLevel} from '../../../commons/logger/log.model';
let moment = require('moment');

export class AccountController extends BaseController {

    private _accountService: AccountService;

    constructor(accountService: AccountService = new AccountService()) {
        super();
        this._accountService = accountService;
    }

    public checkAccountName: ((req: Request, res: Response, next: Function) => void)
    = async (req: Request, res: Response, next: Function): Promise<void> => {
        try {
            if (req.body && req.body.name) {
                try {
                    let status = await this._accountService.checkAccountName(req.body.name);

                    if (status) {
                        res.sendStatus(200);
                    } else {
                        throw new AccountCheckInvalid('something went wrong');
                    }
                } catch (error) {
                    this.log(LogLevel.WARN, 'Invalid AccountCheck - AccountServices delivers error ' + error);
                    next(error);
                }

            } else {
                this.log(LogLevel.WARN, 'Invalid AccountCheck Parameters');
                next(new AccountCheckInvalid('Parameters not valid'));
            }
        } catch (err) {
            this.log(LogLevel.ERROR, 'General Error on AccountCheck' + err);
            next(new AccountCheckInvalid(err.message));
        }
    };

    public createAccount: ((req: Request, res: Response, next: Function) => void)
        = async (req: Request, res: Response, next: Function): Promise<void> => {
        try {
            if (req.body && req.body.name && req.body.displayName) {
                try {
                    let status = await this._accountService.checkAccountName(req.body.name);

                    if (status) {
                        const caccount = new accountModel({
                            activatedOn: moment(),
                            createdOn: moment(),
                            displayName: req.body.displayName,
                            name: req.body.name,
                            state: AccountState.PENDING,
                        });
                        return await this._accountService.createAsync(caccount);
                    } else {
                        throw new AccountCheckInvalid('something went wrong');
                    }
                } catch (error) {
                    next(error);
                }

            } else {
                next(new AccountCheckInvalid('Parameters not valid'));
            }
        } catch (err) {
            next(new AccountCheckInvalid(err));
        }
    };
}
