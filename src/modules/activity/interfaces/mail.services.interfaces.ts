import {IActionEmailModel} from '../models/action.email.model';
import {IMailResponse, IRawMailDataModel} from './mail.models.interfaces';

export interface IActionEmailService {
    findById(id: string);
    create(actionEmail: IActionEmailModel);
    confirmActionEmail(id: string);
}

export interface IMailService {
    send(mailData: IRawMailDataModel): Promise<IMailResponse>;
}
