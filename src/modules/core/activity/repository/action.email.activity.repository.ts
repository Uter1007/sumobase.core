import { injectable, inject } from 'inversify';
import {BaseRepository} from '../../../core/base/base.repository';
import {ILogger, ILoggerName} from '../../../core/logging/interfaces/logger.interface';
import {IActivityEmailDBSchema, activityEmailDBModel} from '../models/action.email.activity.db.model';
import {IActionEmailRepository} from '../interfaces/action.email.repository.interface';

@injectable()
export class ActionEmailRepository extends BaseRepository<IActivityEmailDBSchema> implements IActionEmailRepository {
    constructor(@inject(ILoggerName) log: ILogger) {
        super(log);
        this._model = activityEmailDBModel;
    }
}
