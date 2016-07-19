import {LogLevel} from '../../../commons/logger/logModel';
import {BaseService} from '../../../commons/base/baseService';
import {ActionEmailRepository} from './actionEmailRepository';
import {IActionEmailModel, ActionEmailState} from '../models/actionEmailModel';

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
