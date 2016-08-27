import { injectable, inject } from 'inversify';
import { ILogger } from '../../../core/logging/interfaces/logger.interface';
import { IUser } from '../interfaces/user.interface';
import { IUserDBSchema } from '../models/user.db.model';
import { UserState } from '../models/userstate.model';

import {SVC_TAGS,
        REPO_TAGS,
        MAPPER_TAGS} from '../../../../registry/constants.index';

import {PasswordsNotEqualException} from '../../../core/error/models/password.notequal.exception';

import {UserMapper} from '../mapper/user.mapper';
import {PasswordService} from './password.service';
import {UnknownException} from '../../../core/error/models/unknown.exception';
import {UserNotFoundException} from '../../../core/error/models/user.notfound.exception';
import {UserAvatarMapper} from '../mapper/user.avatar.mapper';
import {IUserAvatar} from '../interfaces/user.avatar.interface';
import * as moment from 'moment';
import {IUserRepository} from '../interfaces/user.repository.interface';

@injectable()
export class UserService {

    constructor(@inject(SVC_TAGS.Logger) private _log: ILogger,
                @inject(REPO_TAGS.UserRepository) private _userRepository: IUserRepository,
                @inject(MAPPER_TAGS.UserMapper) private _userMapper: UserMapper,
                @inject(SVC_TAGS.PasswordService) private _pw: PasswordService,
                @inject(MAPPER_TAGS.UserAvatarMapper) private _userAvatarMapper: UserAvatarMapper) {
    }

    public async findUserByUserNameAndPassword(userName: string, password: string) {
        try {

            let user =  await this._userRepository.findOne({ 'email': userName });
            return this._pw.compare(password, user.password)
                .then((result) => {
                    if (result) {
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

    // todo: maybe change baseRepo update to use find and update on its own
    public async update(userModel: IUser) {
        try {
            let foundUser = await this.findUserById(userModel.id);
            if (!foundUser) {
                throw new UserNotFoundException('User can not be found');
            }
            foundUser.firstName = userModel.firstName;
            foundUser.lastName = userModel.lastName;
            let updateSuccess = await this._userRepository.update(foundUser.id, foundUser);
            if (updateSuccess) {
                return this._userMapper.toUser(foundUser);
            }
            throw new UnknownException('User can not be updated');
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async updateImage(id: string, image: Buffer, contentType: string): Promise<boolean> {
        try {
            let foundUser = await this.findUserById(id);
            if (!foundUser) {
                throw new UserNotFoundException('User can not be found');
            }
            foundUser.avatar = {contentType: contentType, data: image};
            let updateSuccess = await this._userRepository.update(foundUser.id, foundUser);
            if (updateSuccess) {
                return true;
            }
            throw new UnknownException('User can not be updated');
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async retrieveImage(id: string): Promise<IUserAvatar> {
        try {
            let foundUser = await this.findUserById(id);
            if (foundUser) {
                if (foundUser.avatar) {
                    return this._userAvatarMapper.toUserAvatar(foundUser.avatar);
                }
            }
            return undefined;
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async updatePassword(id: string, password: string) {
        try {
            let foundUser = await this.findUserById(id);
            if (!foundUser) {
                throw new UserNotFoundException('User can not be found');
            }
            let hashpw = await this.hashPassword(password);
            foundUser.password = hashpw;
            let updateSuccess = await this._userRepository.update(foundUser.id, foundUser);
            if (updateSuccess) {
                return true;
            }
            throw new UnknownException('User can not be updated');
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
            toDbModel.createdOn = moment().utc().toString();
            let dbmodel = await this._userRepository.create(toDbModel);
            return this._userMapper.toUser(dbmodel);
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async activateUser(id: string): Promise<boolean> {
        try {
            let foundUser: IUserDBSchema = await this._userRepository.findById(id);
            if (!foundUser) {
                throw new UserNotFoundException('User can not be found');
            }
            foundUser.state = UserState.ACTIVE;
            let updateSuccess = await this._userRepository.update(foundUser.id, foundUser);
            if (updateSuccess) {
                return true;
            }
            throw new UnknownException('User can not be updated');
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    private async hashPassword(pw: string): Promise<any> {
        return this._pw.hash(pw);
    }
}

