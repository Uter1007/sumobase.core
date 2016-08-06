import { injectable, inject } from 'inversify';
import { UserRepository } from '../repository/user.repository';
import { ILogger } from '../../commons/logging/interfaces/logger.interface';
import { IUser } from '../interfaces/user.interface';
import { IUserDBSchema } from '../models/user.db.model';
import { UserState } from '../models/userstate.model';

import REPO_TAGS from '../../../constant/repositories.tags';
import SVC_TAGS from '../../../constant/services.tags';
import {PasswordsNotEqualException} from '../../commons/error/models/password.notequal.exception';
import MAPPER_TAGS from '../../../constant/mapper.tags';
import {UserMapper} from '../mapper/user.mapper';
import {PasswordService} from './password.service';

@injectable()
export class UserService {

    private _userRepository: UserRepository;
    private _log: ILogger;
    private _userMapper: UserMapper;
    private _pw: PasswordService;

    constructor(@inject(SVC_TAGS.Logger) log: ILogger,
                @inject(REPO_TAGS.UserRepository)  userRepository: UserRepository,
                @inject(MAPPER_TAGS.UserMapper) userMapper: UserMapper,
                @inject(SVC_TAGS.PasswordService) pw: PasswordService) {
        this._userRepository = userRepository;
        this._log = log;
        this._userMapper = userMapper;
        this._pw = pw;
    }

    public async findUserByUserNameAndPassword(userName: string, password: string) {
        try {

            let user =  await this._userRepository.findOne({ 'email': userName });
            return this._pw.compare(password, user.password).then(result => {
                if(result) {
                    return user;
                } else {
                    throw new PasswordsNotEqualException('Not in my House !');
                }
            });

        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async findUserByName(userName: string) {
        try {
            return await this._userRepository.findOne({'email': userName, });
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async findUserById(userId) {
        try {
            return await this._userRepository.findById(userId);
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async create(userModel: IUser, password: string) {
        try {
            let hashpw = await this.hashPassword(password);
            let toDbModel = this._userMapper.toDBmodel(userModel);
            toDbModel.password = hashpw;
            let dbmodel = await this._userRepository.create(toDbModel);
            return this._userMapper.toUser(dbmodel);
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async activateUser(id: string) {
        try {
            const user: IUserDBSchema = await this._userRepository.findById(id);
            user.state = UserState.ACTIVE;

            return await this._userRepository.update(user.id, user);
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    private async hashPassword(pw: string): Promise<any> {
        return this._pw.hash(pw, 12);
    }
}

export default UserService;
