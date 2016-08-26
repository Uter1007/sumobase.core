import { injectable, inject } from 'inversify';
import {BaseRepository} from '../../../core/base/base.repository';
import {SVC_TAGS} from '../../../../registry/constants.index';
import {ILogger} from '../../../core/logging/interfaces/logger.interface';
import {IActivityEmailDBSchema, activityEmailDBModel} from '../models/action.email.activity.db.model';
import {IActionEmailRepository} from '../interfaces/action.email.repository.interface';

@injectable()
export class ActionEmailRepository extends BaseRepository<IActivityEmailDBSchema> implements IActionEmailRepository {
    constructor(@inject(SVC_TAGS.Logger) log: ILogger) {
        super(log);
        this._model = activityEmailDBModel;
    }
}
