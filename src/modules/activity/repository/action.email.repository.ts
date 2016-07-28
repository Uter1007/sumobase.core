import {IActionEmailModel, actionEmailModel} from '../models/action.email.model';
import {BaseRepository} from '../../../commons/base/base.repository';

export class ActionEmailRepository extends BaseRepository<IActionEmailModel> {
    constructor() {
        super(actionEmailModel);
    }
}
