import { injectable, inject } from 'inversify';
import {BaseRepository} from '../../commons/base/base.repository';
import {IUserDBSchema, userDBModel} from '../models/user.db.model';
import SVC_TAGS from '../../../constant/services.tags';
import {ILogger} from '../../commons/logging/interfaces/logger.interface';

@injectable()
export class UserRepository extends BaseRepository<IUserDBSchema> {
    constructor(@inject(SVC_TAGS.Logger) log: ILogger) {
        super(log);
        this._model = userDBModel;
    }
}
