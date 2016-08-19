import { injectable, inject } from 'inversify';
import {BaseRepository} from '../../commons/base/base.repository';
import {IUserDBSchema, userDBModel} from '../models/user.db.model';
import SVC_TAGS from '../../../constants/services.tags';
import {ILogger} from '../../commons/logging/interfaces/logger.interface';
import {IUserRepository} from '../interfaces/user.repository.interface';

@injectable()
export class UserRepository extends BaseRepository<IUserDBSchema> implements IUserRepository {
    constructor(@inject(SVC_TAGS.Logger) log: ILogger) {
        super(log);
        this._model = userDBModel;
    }
}
