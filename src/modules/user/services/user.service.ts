import {UserRepository} from '../repository/user.repository';
import {injectable, inject} from 'inversify';
import {ILogger} from '../../commons/logging/interfaces/logger.interface';
import SVC_TAGS from '../../../constant/services.tags';
import REPO_TAGS from '../../../constant/repositories.tags';
import {IUser} from '../interfaces/user.interface';
import {IUserDBSchema} from '../models/user.db.model';
import {UserState} from '../models/userstate.model';
import {User} from '../models/user.model';

/* tslint:disable */
let bcrypt = require('bcrypt');
/* tslint:enable */

@injectable()
class UserService {

    private _userRepository: UserRepository;
    private _log: ILogger;

    constructor(@inject(SVC_TAGS.Logger) log: ILogger,
                @inject(REPO_TAGS.UserRepository) userRepository: UserRepository) {
        this._userRepository = userRepository;
        this._log = log;
    }

    public async findUserByUserNameAndPasswordAsync(userName: string, password: string) {
        try {

            let user =  await this._userRepository.findOne({ 'username': userName });

            return new Promise( (resolve: any, reject: any) => {
                bcrypt.compare(password, user.password, function(err, res) {
                    if (err) {
                        return reject(err);
                    } else {
                        if (res) {
                            return resolve(user);
                        } else {
                            return reject( new Error('Not in my House !'));
                        }
                    }
                });
            });

        } catch (err) {
            this._log.error('An error occured:', err);
            return err;
        }
    }

    public async findUserByNameAsync(userName: string) {
        try {
            return await this._userRepository.findOne({'username': userName, });
        } catch (err) {
            this._log.error('An error occured:', err);
            return err;
        }
    }

    public async findUserByIdAsync(userId) {
        try {
            return await this._userRepository.findById(userId);
        } catch (err) {
            this._log.error('An error occured:', err);
            return err;
        }
    }

    public async createAsync(userModel: IUser, password: string) {
        try {
            let hashpw = await this.hashPassword(password);
            let toDbModel = userModel.toDBmodel();
            toDbModel.password = hashpw;
            let dbmodel = await this._userRepository.create(toDbModel);
            return User.createFromDB(dbmodel);
        } catch (err) {
            this._log.error('An error occured:', err);
            return err;
        }
    }

    public async activateUser(id: string) {
        try {
            const user: IUserDBSchema = await this._userRepository.findById(id);
            user.userState = UserState.ACTIVE;

            return await this._userRepository.update(user.id, user);
        } catch (err) {
            this._log.error('An error occured:', err);
            return err;
        }
    }

    private hashPassword(pw: string): Promise<any> {
        return new Promise( (resolve: any, reject: any) => {
            bcrypt.hash(pw, 12, function (err, hash) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(hash);
                }
            });
        });
    }
}

export default UserService;
