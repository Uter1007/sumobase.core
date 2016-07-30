import {BaseRepository} from '../../base/base.repository';
import { injectable, inject, named } from 'inversify';
import * as mongoose from 'mongoose';

import {IUserDBSchema, userDBModel} from '../models/user.db.model';

@injectable()
export class UserRepository extends BaseRepository<IUserDBSchema> {
    constructor() {
        super();
        this._model = userDBModel;
    }
}
