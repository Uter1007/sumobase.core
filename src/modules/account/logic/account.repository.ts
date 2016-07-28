import {IAccountModel, accountModel} from '../models/account.model';
import {BaseRepository} from '../../../commons/base/base.repository';

export class AccountRepository extends BaseRepository<IAccountModel> {
    constructor() {
        super(accountModel);
    }
}
