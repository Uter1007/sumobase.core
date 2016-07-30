import { injectable } from 'inversify';
import {BaseRepository} from '../../commons/base/base.repository';
import {IUserDBSchema, userDBModel} from '../models/user.db.model';

@injectable()
export class UserRepository extends BaseRepository<IUserDBSchema> {
    constructor() {
        super();
        this._model = userDBModel;
    }
}
