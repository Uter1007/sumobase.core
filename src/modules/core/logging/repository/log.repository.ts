import {ILogModel, logDAO} from '../models/logmodel.db.model';
import {BaseRepository} from '../../base/base.repository';
import { injectable, inject } from 'inversify';
import {ILogger, ILoggerName} from '../interfaces/logger.interface';

@injectable()
export class LogRepository extends BaseRepository<ILogModel> {
    constructor(@inject(ILoggerName) log: ILogger) {
        super(log);
        this._model = logDAO;
    }
}
