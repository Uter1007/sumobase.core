import {IRawMailDataModel, IMailResponse} from '../interfaces/mail.service.interface';
import { injectable } from 'inversify';
import ConfigLoader from '../../configloader/configloader.service';
const mailConfig = ConfigLoader.getConfig().mail;

/* tslint:disable */
const mailgun = require('mailgun-js')({apiKey: mailConfig.apiKey, domain: mailConfig.domain});
/* tslint:enable */

import * as Promise from 'bluebird';
import {IMailFacade} from '../interfaces/mailfacade.interface';

@injectable()
export class MailGunService implements IMailFacade {

    private _from: string;

    constructor() {
        this._from = mailConfig.sender;
    }

    public send(mailData: IRawMailDataModel): Promise<IMailResponse> {
        return new Promise<IMailResponse>((resolve, reject) => {
            mailgun.messages().send(
                {
                    from: this._from,
                    html: mailData.html,
                    subject: mailData.subject,
                    to: mailData.to
                },
                function (error, body) {
                    if (!error) {
                        resolve(body);
                    } else {
                        reject(error);
                    }
                }
            );
        });
    }
}

export default MailGunService;
