import { injectable, inject } from 'inversify';
import {BaseRepository} from '../../commons/base/base.repository';
import SVC_TAGS from '../../../constant/services.tags';
import {ILogger} from '../../commons/logging/interfaces/logger.interface';
import {IActivityEmailDBSchema, activityEmailDBModel} from '../models/action.email.activity.db.model';

@injectable()
export class ActionEmailRepository extends BaseRepository<IActivityEmailDBSchema> {
    constructor(@inject(SVC_TAGS.Logger) log: ILogger) {
        super(log);
        this._model = activityEmailDBModel;
    }
}