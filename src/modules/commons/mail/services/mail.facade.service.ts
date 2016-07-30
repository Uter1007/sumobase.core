import ConfigLoader from '../../configLoader/configLoader.service';
import {IRawMailDataModel, IMailResponse} from '../models/maildata.model';

const mailConfig = ConfigLoader.getConfig().mail;
const mailgun = require('mailgun-js')({apiKey: mailConfig.apiKey, domain: mailConfig.domain});
// const handlebars = require('handlebars');

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
                    to: mailData.to,
                    subject: mailData.subject,
                    html: html
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
