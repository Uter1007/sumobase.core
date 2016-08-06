import ConfigLoader from '../../configloader/configLoader.service';
import {IRawMailDataModel, IMailResponse} from '../models/maildata.model';

const mailConfig = ConfigLoader.getConfig().mail;

/* tslint:disable */
const mailgun = require('mailgun-js')({apiKey: mailConfig.apiKey, domain: mailConfig.domain});
// const handlebars = require('handlebars');
/* tslint:enable */

import * as Promise from 'bluebird';

export class MailFacade {

    private _from: string;

    constructor() {
        this._from = 'CleanSumo <office@cleansumo.at>';
    }

    public send(mailData: IRawMailDataModel): Promise<IMailResponse> {
        // const template = handlebars.compile(mailData.template);
        // const html = template(mailData.data);

        const html = mailData.template;

        return new Promise<IMailResponse>((resolve, reject) => {
            mailgun.messages().send(
                {
                    from: this._from,
                    html: html,
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

export default MailFacade;
