import {Request, Response} from 'express';
import {userModel, UserRole, UserState, IUserModel} from '../models/user.model';
import {accountModel, AccountState, IAccountModel} from '../../account/models/account.model';
import {actionEmailModel,
        IActionEmailModel,
        ActionEmailState,
        ActionEmailType} from '../../activity/models/action.email.model';
import {UserService} from '../logic/user.service';
import {AccountService} from '../../account/logic/account.service';
import {ActionEmailService} from '../../activity/logic/action.email.service';
import {LogLevel} from '../../../commons/logger/log.model';
import {
    RegisterParametersNotValid,
    AccountCheckInvalid,
    ConfirmationTokenNotValid,
    ConfirmationTokenExpired
} from '../../../commons/errors/models/user.mgmt.exceptions';
import {BaseController} from '../../../commons/base/base.controller';
import * as Promise from 'bluebird';
import {MailFacade} from '../../activity/logic/mail.facade';
let moment = require('moment');

export class UserController extends BaseController {

    private _accountService: AccountService;
    private _userService: UserService;
    private _mailFacade: MailFacade;
    private _actionEmailService: ActionEmailService;

    constructor() {
        super();
        this._accountService = new AccountService();
        this._userService = new UserService();
        this._mailFacade = new MailFacade();
        this._actionEmailService = new ActionEmailService();
    }

    public register: ((req: Request, res: Response, next: Function) => void)
    = async (req: Request, res: Response, next: Function): Promise<void> => {
        try {
            if (this.paramCheck(req)) {
                const account = await this.handleRegisterAccount(req.body.account.name, req.body.account.displayName);

                let userresp = await this.handleRegisterUser(<any>req.body.user, account);
                let userret =  <IUserModel>userresp.toObject();
                delete userret.password;

                if (userresp.email) {
                    this.handleActionEmail(account, userresp);
                }

                res.send(userret);
            } else {
                throw new RegisterParametersNotValid('Parameters not valid');
            }
        } catch (err) {
            res.send(err);
        }
    };

    public confirm: ((req: Request, res: Response, next: Function) => void)
        = async (req: Request, res: Response, next: Function): Promise<void> => {
        try {
            const confirmationToken: IActionEmailModel = await this._actionEmailService.findById(req.body.tokenId);

            if (!confirmationToken) {
                throw new ConfirmationTokenNotValid();
            }

            if (moment(confirmationToken.invalidAt).isAfter(moment())) {
                const userId = confirmationToken.user.toString();
                await this._userService.activateUser(userId);

                const activatedUser = await this._userService.findUserByIdAsync(userId);
                await this._accountService.activateAccountByUserId(activatedUser.account.toString());

                await this._actionEmailService.confirmActionEmail(confirmationToken.id);
            } else {
                throw new ConfirmationTokenExpired('expired');
            }

            res.send('');
        } catch (err) {
            res.send(err);
        }
    };

    public me: ((req: Request, res: Response, next: Function) => void)
    = async (req: Request, res: Response, next: Function): Promise<void> => {

        try {
            if (req.user) {
                let userresp = await this._userService.findUserByIdAsync(req.user.id);
                let userret =  <IUserModel>userresp.toObject();
                delete userret.password;
                res.send(userret);
            }
        } catch (err) {
            res.send(err);
        }
    };

    private paramCheck(req: Request) {
        return (req.body &&
                req.body.user &&
                req.body.account &&
                req.body.account.displayName &&
                req.body.account.name);
    }

    // move to userService
    private handleRegisterUser: ((userReq: IUserModel, account: IAccountModel) => Promise<IUserModel>)
        = async (userReq: IUserModel, account: IAccountModel): Promise<IUserModel> => {
        try {
            const user = new userModel({
                account: account,
                createdOn: moment(),
                email: userReq.email,
                firstName: userReq.firstName,
                lastName: userReq.lastName,
                modifiedOn: moment(),
                password: userReq.password,
                role: UserRole.EMPLOYEE,
                state: UserState.PENDING,
                username: userReq.username
            });

            let retuser = await this._userService.createAsync(user);

            this.log(LogLevel.DEBUG, 'User was created: ' + retuser.username);

            return retuser;
        } catch (err) {
            throw err;
        }
    };

    private handleRegisterAccount: ((accountName: string, displayName: string) => Promise<IAccountModel>)
    = async (accountName: string, displayName: string): Promise<IAccountModel> => {
        try {
            let status = await this._accountService.checkAccountName(accountName);

            if (status) {
                const caccount = new accountModel({
                    activatedOn: moment(),
                    createdOn: moment(),
                    displayName: displayName,
                    name: accountName,
                    state: AccountState.PENDING,
                });
                return await this._accountService.createAsync(caccount);
            } else {
                throw new AccountCheckInvalid('something went wrong');
            }
        } catch (error) {
            throw error;
        }
    };

    private handleActionEmail: ((account: IAccountModel, user: IUserModel) => Promise<void>)
    = async (account: IAccountModel, user: IUserModel): Promise<void> => {

        try {
            const now = moment();
            // todo move to config
            const invalidationDate = moment().add(72, 'hours');

            const actionEmail = new actionEmailModel({
                type: ActionEmailType.ACCOUNT_CONFIRMATION,
                state: ActionEmailState.UNCONFIRMED,
                invalidAt: invalidationDate,
                user: user,
                account: account,
                createdOn: now,
                modifiedOn: now
            });

            let retActionEmail = await this._actionEmailService.create(actionEmail);

            const fullName = [user.firstName, user.lastName].join(' ');
            await this._mailFacade.sendActivationMail(fullName, user.email, retActionEmail.id);
            this.log(LogLevel.DEBUG, 'Activation Email was sent');

            return retActionEmail;
        } catch (err) {
            throw err;
        }
    };
}
