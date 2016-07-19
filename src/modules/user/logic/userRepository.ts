import {IUserModel, userModel} from '../models/userModel';
import {BaseRepository} from '../../../commons/base/baseRepository';

export class UserRepository extends BaseRepository<IUserModel> {
    constructor() {
        super(userModel);
    }
}
