import { injectable, inject } from 'inversify';
import {BaseRepository} from '../../../core/base/base.repository';
import {IUserDBSchema, userDBModel} from '../models/user.db.model';
import {ILogger, loggerInterfaceName} from '../../../core/logging/interfaces/logger.interface';
import {IUserRepository} from '../interfaces/user.repository.interface';

@injectable()
export class UserRepository extends BaseRepository<IUserDBSchema> implements IUserRepository {
    constructor(@inject(loggerInterfaceName) log: ILogger) {
        super(log);
        this._model = userDBModel;
    }
}
