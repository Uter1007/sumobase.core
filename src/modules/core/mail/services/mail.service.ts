import {injectable} from 'inversify';
import {MailGunService} from './mail.gun.service';
import {IMailService} from '../interfaces/mail.service.interface';
import {IMailFacade} from '../interfaces/mailfacade.interface';

import {ConfigLoader} from '../../configloader/configloader.service';
let config = ConfigLoader.getConfig();

/* tslint:disable */
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
/* tslint:enable */

@injectable()
export class MailService implements IMailService {

    private _mailFacade: IMailFacade;
    private _domain: string;
    private _activationUrl: string;
    private _companyName: string;
    private _templateConfig: {
        path: string,
        subject: string
    };

    constructor() {
        this._mailFacade = new MailGunService();

        this._domain = config.domain;
        this._activationUrl = config.urls.activation;
        this._companyName = config.mail.companyName;
        this._templateConfig = config.mail.templates.activation;
    }

    public async sendActivationMail(name: string, email: string, activationToken: string) {
        const templateData = {
            actionLink: this._domain + this._activationUrl + '?c=' + activationToken,
            companyName: this._companyName,
            name: name
        };

        const html = this._compileTemplate(this._templateConfig.path, templateData);

        return await this._mailFacade.send({
            html: html,
            subject: this._templateConfig.subject,
            to: name + '<' + email + '>'
        });
    }

    private _compileTemplate(templatePath: string, data: Object) {
        const templateFileName = path.join(process.cwd(), templatePath);
        const templateFile = fs.readFileSync(templateFileName, 'UTF-8');

        const templateFunc: Function = handlebars.compile(templateFile);
        return templateFunc(data);
    }
}
