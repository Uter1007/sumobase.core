import { injectable, inject } from 'inversify';
import {ActionEmailRepository} from '../repository/action.email.activity.repository';
import {ILogger} from '../../../core/logging/interfaces/logger.interface';
import {EntityState} from '../../../core/base/base.state.enum';
import {ActivationNotValid} from '../../../core/error/models/activation.not.valid.exception';
import {UnknownException} from '../../../core/error/models/unknown.exception';
import {ActionEmailMapper} from '../mapper/action.email.activity.mapper';

import {ActionEmail} from '../models/action.email.activity.model';
import {ActivityType} from '../models/activity.type.enum';
import {IUser} from '../../../feat/user/interfaces/user.interface';
import * as moment from 'moment';

/* tslint:disable */
import crypto = require('crypto');
import {UserService} from '../../../feat/user/services/user.service';
import {UserMapper} from '../../../feat/user/mapper/user.mapper';
import {UserState} from '../../../feat/user/models/userstate.model';
import {UserNotFoundException} from '../../../core/error/models/user.notfound.exception';
import {SVC_TAGS,
        REPO_TAGS,
        MAPPER_TAGS} from '../../../../registry/constants.index';
import {ForgetPasswordNotValid} from '../../error/models/forget.password.exception';

/* tslint:enable */

@injectable()
export class ActionEmailService {

    constructor(@inject(SVC_TAGS.Logger) private _log: ILogger,
                @inject(SVC_TAGS.UserService) private _userService: UserService,
                @inject(REPO_TAGS.ActionEmailRepository) private _actionEmailRepository: ActionEmailRepository,
                @inject(MAPPER_TAGS.ActionEmailMapper) private _actionEmailMapper: ActionEmailMapper,
                @inject(MAPPER_TAGS.UserMapper) private _userMapper: UserMapper) {
    }

    public async createActivationEmail(user: IUser) {
        return await this.createActionEmail(user, ActivityType.ActivationEmail);
    }

    public async createForgotPasswordEmail(user: IUser) {
        return await this.createActionEmail(user, ActivityType.ForgotEmail);
    }

    public async createActionEmail(user: IUser, activityType: ActivityType) {
        try {
            let randomHash = crypto.randomBytes(20).toString('hex');
            let emailActivity = new ActionEmail(randomHash,
                activityType,
                user, undefined,
                EntityState.ACTIVE,
                moment().utc().format('dd.MM.YYYY HH:mm:ss'),
                undefined);

            let dbModel = this._actionEmailMapper.toDBmodel(emailActivity);
            dbModel.createdOn = moment().utc().toString();
            let createdActivity = await this._actionEmailRepository.create(dbModel);
            return await this._actionEmailMapper.toActivityEmail(createdActivity, this._userMapper.toDBmodel(user));
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async updateForgetEmail(hash: string): Promise<IUser> {
        try {

            let foundActivity = await this._findActionEmailbyHashAndType(hash, <any>ActivityType.ForgotEmail);
            if (!foundActivity) {
                throw new ForgetPasswordNotValid('No ForgotEmail was found');
            }
            let founduser = await this._userService.findUserById(foundActivity.user);
            if (!founduser) {
                throw new UserNotFoundException('No User was found');
            }
            if (foundActivity.state !== EntityState.ACTIVE) {
                throw new ActivationNotValid('Link is not active anymore');
            }
            let checkdate = moment(foundActivity.createdOn).utc().add(7, 'days');
            if (moment.utc() >= checkdate) {
                throw new ForgetPasswordNotValid('Date ran out');
            }
            foundActivity.state = EntityState.DISABLED;
            let updateSuccess = await this._actionEmailRepository.update(foundActivity.id, foundActivity);

            if (updateSuccess) {
                return founduser;
            }

            throw new UnknownException('ForgetPasswordLink can not be updated');

        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async updateActivationEmail(hash: string): Promise<boolean> {
        try {
            let foundActivity = await this._findActionEmailbyHashAndType(hash, <any>ActivityType.ActivationEmail);
            if (!foundActivity) {
                throw new ActivationNotValid('No ActivationLink was found');
            }
            let founduser = await this._userService.findUserById(foundActivity.user);
            if (!founduser) {
                throw new UserNotFoundException('No User was found');
            }
            if (founduser.state !== UserState.PENDING) {
                throw new ActivationNotValid('User is not in Status Pending anymore');
            }
            if (foundActivity.state !== EntityState.ACTIVE) {
                throw new ActivationNotValid('Activation Link is not active anymore');
            }
            foundActivity.state = EntityState.DISABLED;
            let checkdate = moment(foundActivity.createdOn).utc().add(7, 'days');
            if (moment.utc() >= checkdate) {
                throw new ActivationNotValid('Activation Date ran out');
            }
            let updateSuccess = await this._actionEmailRepository
                                          .update(foundActivity.id, foundActivity);
            if (updateSuccess) {
                return await this._userService.activateUser(foundActivity.user);
            }
            throw new UnknownException('ActivationLink can not be updated');
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    private async _findActionEmailbyHashAndType(hash: string, type: string) {
        try {
            return await this._actionEmailRepository.findOne({'hash': hash, 'type': type });
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

}

