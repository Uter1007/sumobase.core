import {ILogModel, logDAO} from '../models/logmodel.db.model';
import {BaseRepository} from '../../base/base.repository';
import { injectable } from 'inversify';

@injectable()
export class LogRepository extends BaseRepository<ILogModel> {
    constructor() {
        super();
        this._model = logDAO;
    }
}
