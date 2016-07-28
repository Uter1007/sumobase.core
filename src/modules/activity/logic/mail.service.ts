// const request = require('request');
import * as configFile from '../../../config/env/config';

const apiKey = configFile.TestConfig.mail.apiKey;
const domain = configFile.TestConfig.mail.domain;
console.log(apiKey, domain);
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});
const handlebars = require('handlebars');

import * as Promise from 'bluebird';
import {IRawMailDataModel, IMailResponse} from '../interfaces/mail.models.interfaces';
import {IMailService} from '../interfaces/mail.services.interfaces';

export class MailService implements IMailService {

    private _from: string;

    constructor() {
        this._from = 'CleanSumo <office@cleansumo.at>';
    }

    public send(mailData: IRawMailDataModel): Promise<IMailResponse> {
        const template = handlebars.compile(mailData.template);
        const html = template(mailData.data);

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
