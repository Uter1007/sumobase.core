import {ILogModel, logDAO} from '../models/logmodel.db.model';
import {BaseRepository} from '../../base/base.repository';
import { injectable, inject } from 'inversify';
import {ILogger} from '../interfaces/logger.interface';
import SVC_TAGS from '../../../../constant/services.tags';

@injectable()
export class LogRepository extends BaseRepository<ILogModel> {
    constructor(@inject(SVC_TAGS.Logger) log: ILogger) {
        super(log);
        this._model = logDAO;
    }
}
