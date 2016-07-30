import {BaseRepository} from '../../commons/base/base.repository';
import { injectable} from 'inversify';

import {IUserDBSchema, userDBModel} from '../models/user.db.model';

@injectable()
export class UserRepository extends BaseRepository<IUserDBSchema> {
    constructor() {
        super();
        this._model = userDBModel;
    }
}
