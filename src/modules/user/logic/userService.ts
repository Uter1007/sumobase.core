import {UserRepository} from './userRepository';
import {IUserModel, UserState} from '../models/userModel';
import {LogLevel} from '../../../commons/logger/logModel';

import * as configFile from '../../../config/env/config';
import * as Promise from 'bluebird';
import {PasswordsNotEqual} from '../../errors/models/userMgmtExceptions';
import {BaseService} from '../../../commons/base/baseService';

let bcrypt = require('bcrypt');

export class UserService extends BaseService {

    private _userRepository: UserRepository;

    constructor() {
        super();
        this._userRepository = new UserRepository();
    }

    private hashPassword(pw: string): Promise<any> {
        return new Promise( (resolve: any, reject: any) => {
            bcrypt.hash(pw, configFile.TestConfig.password.saltRounds, function (err, hash) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(hash);
                }
            });
        });
    }

    public async findUserByUserNameAndPasswordAsync(userName: string, password: string, accountId: string) {
        try {

            let user =  await this._userRepository.findOne({ 'account': accountId,
                                                             'username': userName, });

            return new Promise( (resolve: any, reject: any) => {
                bcrypt.compare(password, user.password, function(err, res) {
                    if (err) {
                        return reject(err);
                    } else {
                        if (res) {
                            return resolve(user);
                        } else {
                            return reject( new PasswordsNotEqual('Not in my Hosue !'));
                        }
                    }
                });
            });

        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    }

    public async findUserByNameAsync(userName: string, accountId: string) {
        try {
            return await this._userRepository.findOne({ 'account': accountId,
                                                        'username': userName, });
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    }

    public async findUserByIdAsync(userId) {
    try {
        return await this._userRepository.findById(userId);
    } catch (err) {
        this.log(LogLevel.ERROR, err);
        return err;
    }
}

    public async createAsync(userModel: IUserModel) {
        try {
            let hashpw = await this.hashPassword(userModel.password);
            userModel.password = hashpw;
            return await this._userRepository.create(userModel);
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    }

    public async activateUser(id: string) {
        try {
            const user: IUserModel = await this._userRepository.findById(id);
            user.state = UserState.ACTIVE;

            return await this._userRepository.update(user.id, user);
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    }
}
