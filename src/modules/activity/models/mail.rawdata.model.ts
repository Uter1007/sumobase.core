import {BaseModel} from '../../../commons/base/base.model';
import {IRawMailDataModel} from '../interfaces/mail.models.interfaces';

export class MailRawData extends BaseModel implements IRawMailDataModel {
    public to: string;
    public subject: string;
    public template: string;
    public data: any;

    constructor() {
        super();
    }

}
