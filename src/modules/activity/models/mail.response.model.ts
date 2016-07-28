import {IMailResponse} from '../interfaces/mail.models.interfaces';
import {BaseModel} from '../../../commons/base/base.model';

export class MailResponse extends BaseModel implements IMailResponse {
    public id: string;
    public message: string;

    constructor() {
        super();
    }

}
