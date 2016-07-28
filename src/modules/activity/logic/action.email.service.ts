import {LogLevel} from '../../../commons/logger/log.model';
import {BaseService} from '../../../commons/base/base.service';
import {ActionEmailRepository} from '../repository/action.email.repository';
import {IActionEmailModel, ActionEmailState} from '../models/action.email.model';

export class ActionEmailService extends BaseService {

    private _actionEmailRepository: ActionEmailRepository;

    constructor() {
        super();
        this._actionEmailRepository = new ActionEmailRepository();
    }

    public async findById(id: string) {
        try {
            return await this._actionEmailRepository.findById(id);
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    }

    public async create(actionEmail: IActionEmailModel) {
        try {
            return await this._actionEmailRepository.create(actionEmail);
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    }

    public async confirmActionEmail(id: string) {
        try {
            const actionEmail: IActionEmailModel = await this._actionEmailRepository.findById(id);
            actionEmail.state = ActionEmailState.CONFIRMED;

            return await this._actionEmailRepository.update(actionEmail.id, actionEmail);
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    }
}
