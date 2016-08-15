import { injectable, inject } from 'inversify';
import {ActionEmailRepository} from '../repository/action.email.activity.repository';
import {ILogger} from '../../commons/logging/interfaces/logger.interface';
import SVC_TAGS from '../../../constant/services.tags';
import REPO_TAGS from '../../../constant/repositories.tags';
import {IActivityEmail} from '../interfaces/action.email.activity.interface';
import {EntityState} from '../../commons/base/base.state.enum';
import {ActivationNotValid} from '../../commons/error/models/activation.not.valid.exception';
import {UnknownException} from '../../commons/error/models/unknown.exception';
import {ActionEmailMapper} from '../mapper/action.email.activity.mapper';
import MAPPER_TAGS from '../../../constant/mapper.tags';
import {ActionEmail} from '../models/action.email.activity.model';
import {ActivityType} from '../models/activity.type.enum';
import {IUser} from '../../user/interfaces/user.interface';

/* tslint:disable */
import moment = require('moment');
import crypto = require('crypto');
import {UserService} from '../../user/services/user.service';

/* tslint:enable */

@injectable()
export class ActionEmailService {
    private _log: ILogger;
    private _actionEmailRepository: ActionEmailRepository;
    private _actionEmailMapper: ActionEmailMapper;
    private _userService: UserService;

    constructor(@inject(SVC_TAGS.Logger) log: ILogger,
                @inject(SVC_TAGS.UserService) userService: UserService,
                @inject(REPO_TAGS.ActionEmailRepository) actionEmailRepository: ActionEmailRepository,
                @inject(MAPPER_TAGS.ActionEmailMapper) actionEmailMapper: ActionEmailMapper) {
        this._log = log;
        this._actionEmailRepository = actionEmailRepository;
        this._actionEmailMapper = actionEmailMapper;
        this._userService = userService;
    }

    public async findActionEmailbyHash(hash: string) {
        try {
            let actionEmail = await this._actionEmailRepository.findOne({'hash': hash });
            let user = await this._userService.findUserById(actionEmail.user.id);
            actionEmail.user = user;
            return actionEmail;
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
                                                undefined,
                                                undefined);

            let dbModel = this._actionEmailMapper.toDBmodel(emailActivity);
            let createdActivity = await this._actionEmailRepository.create(dbModel);
            return await this._actionEmailMapper.toActivityEmail(createdActivity);
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

    public async updateActivationEmail(hash: string) {
        try {
            let foundActivity = await this.findActionEmailbyHash(hash);
            if (foundActivity) {
                if ( foundActivity.state === EntityState.ACTIVE) {
                    foundActivity.state = EntityState.DISABLED;
                    let updateSuccess = await this._actionEmailRepository.update(foundActivity.id, foundActivity);
                    let checkdate = moment(foundActivity.createdOn).utc().add('days', 7);
                    if (moment.utc() >= checkdate) {
                        throw new ActivationNotValid('Activation Date ran out');
                    }
                    if (updateSuccess) {
                        return this._actionEmailMapper.toActivityEmail(foundActivity);
                    }
                    throw new UnknownException('ActivationLink can not be updated');
                } else {
                    throw new ActivationNotValid('Activation Link is not active anymore');
                }
            }
            throw new ActivationNotValid('No ActivationLink was found');
        } catch (err) {
            this._log.error('An error occurred:', err);
            return err;
        }
    }

}

export default ActionEmailRepository;
