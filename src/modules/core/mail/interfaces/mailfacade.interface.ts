import {IMailResponse, IRawMailDataModel} from './mail.service.interface';
export interface IMailFacade {
    send(mailData: IRawMailDataModel): Promise<IMailResponse>;
}
