import {IActionEmailModel, actionEmailModel} from '../models/actionEmailModel';
import {BaseRepository} from '../../../commons/base/baseRepository';

export class ActionEmailRepository extends BaseRepository<IActionEmailModel> {
    constructor() {
        super(actionEmailModel);
    }
}
