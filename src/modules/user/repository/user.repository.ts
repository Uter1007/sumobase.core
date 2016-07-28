import {IUserModel, userModel} from '../models/user.model';
import {BaseRepository} from '../../../commons/base/base.repository';

export class UserRepository extends BaseRepository<IUserModel> {
    constructor() {
        super(userModel);
    }
}
