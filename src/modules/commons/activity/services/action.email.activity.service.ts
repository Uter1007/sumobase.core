import { injectable, inject } from 'inversify';
import {ActionEmailRepository} from '../repository/action.email.activity.repository';
import {ILogger} from '../../../commons/logging/interfaces/logger.interface';
import SVC_TAGS from '../../../../constants/services.tags';
import REPO_TAGS from '../../../../constants/repositories.tags';
import {EntityState} from '../../../commons/base/base.state.enum';
import {ActivationNotValid} from '../../../commons/error/models/activation.not.valid.exception';
import {UnknownException} from '../../../commons/error/models/unknown.exception';
import {ActionEmailMapper} from '../mapper/action.email.activity.mapper';
import MAPPER_TAGS from '../../../../constants/mapper.tags';
import {ActionEmail} from '../models/action.email.activity.model';
import {ActivityType} from '../models/activity.type.enum';
import {IUser} from '../../../user/interfaces/user.interface';
import * as moment from 'moment';

/* tslint:disable */
import crypto = require('crypto');
import {UserService} from '../../../user/services/user.service';
import {userDBModel} from '../../../user/models/user.db.model';
import {UserMapper} from '../../../user/mapper/user.mapper';
import {UserState} from '../../../user/models/userstate.model';
import {UserNotFoundException} from '../../../commons/error/models/user.notfound.exception';

/* tslint:enable */

@injectable()
export class ActionEmailService {
    private _log: ILogger;
    private _actionEmailRepository: ActionEmailRepository;
    private _actionEmailMapper: ActionEmailMapper;
    private _userService: UserService;
    private _userMapper: UserMapper;

    constructor(@inject(SVC_TAGS.Logger) log: ILogger,
                @inject(SVC_TAGS.UserService) userService: UserService,
                @inject(REPO_TAGS.ActionEmailRepository) actionEmailRepository: ActionEmailRepository,
                @inject(MAPPER_TAGS.ActionEmailMapper) actionEmailMapper: ActionEmailMapper,
                @inject(MAPPER_TAGS.UserMapper) userMapper: UserMapper) {
        this._log = log;
        this._actionEmailRepository = actionEmailRepository;
        this._actionEmailMapper = actionEmailMapper;
        this._userService = userService;
        this._userMapper = userMapper;
    }

    public async findActionEmailbyHash(hash: string) {
        try {
            return await this._actionEmailRepository.findOne({'hash': hash });
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async createActivationEmail(user: IUser) {
        try {

            let randomHash = crypto.randomBytes(20).toString('hex');
            let emailActivity = new ActionEmail(randomHash,
                                                ActivityType.ActiviationEmail,
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

    public async updateActivationEmail(hash: string): Promise<boolean> {
        try {
            let foundActivity = await this.findActionEmailbyHash(hash);
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

}

export default ActionEmailRepository;
