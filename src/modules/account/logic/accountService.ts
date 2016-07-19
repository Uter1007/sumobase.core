import {IAccountModel, AccountState} from '../models/accountModel';
import {AccountRepository} from './accountRepository';
import {LogLevel} from '../../../commons/logger/logModel';
import {BaseService} from '../../../commons/base/baseService';
import {
    AccountAlreadyInUseException,
    AccountNameNotValidException,
    AccountParametersException,
} from '../../errors/models/userMgmtExceptions';
import * as Promise from 'bluebird';

export class AccountService extends BaseService {

    private _accountRepository: AccountRepository;

    private urlRegEx: RegExp = /^[a-z0-9-]+$/;

    constructor() {
        super();
        this._accountRepository = new AccountRepository();
    }

    public async findAccountByNameAsync(accountName: string) {
        try {
            return await this._accountRepository.findOne({'name': accountName});
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    }

    public async createAsync(accountModel: IAccountModel) {
        try {
            return await this._accountRepository.create(accountModel);
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    }

    public async checkAccountName(name: string): Promise<boolean> {
        if (name) {

            let account = await this.findAccountByNameAsync(name);

            if (account) {
                throw new AccountAlreadyInUseException('Name already in use');
            } else {

                if (this.urlRegEx.test(name)) {
                    return true;
                } else {
                    throw new AccountNameNotValidException('AccountName not valid');
                }
            }
        } else {
            throw new AccountParametersException('Account Parameters are not valid');
        }
    }

    public async activateAccountByUserId(id: string): Promise<boolean> {
        try {
            const account: IAccountModel = await this._accountRepository.findById(id);
            account.state = AccountState.ACTIVE;

            return await this._accountRepository.update(account.id, account);
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    }
}
