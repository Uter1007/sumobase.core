import {IAccountModel, accountModel} from '../models/accountModel';
import {BaseRepository} from '../../../commons/base/baseRepository';

export class AccountRepository extends BaseRepository<IAccountModel> {
    constructor() {
        super(accountModel);
    }
}
