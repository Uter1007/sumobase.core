import { injectable } from 'inversify';
import { MailGunService } from './mail.gun.service';
import { IMailService } from '../interfaces/mail.service.interface';
import {IMailFacade} from '../interfaces/mailfacade.interface';

@injectable()
export class MailService implements IMailService {

    private _mailFacade: IMailFacade;

    constructor() {
        this._mailFacade = new MailGunService();
    }

    public async sendHelloWorldPlain() {
        const template = '<p>Hello world {{foobar}}</p>';

        const data = { 'foobar': 'foobar'};

        return await this._mailFacade.send({
            data: data,
            subject: 'Hello World',
            template: template,
            to: 'CleanSumoDev <cleansumodev@mailinator.com>'
        });
    }

    public async sendActivationMail(name: string, email: string, activationToken: string) {
        const template = '<p>Hallo {{name}},<br>hier ist dein Aktivierungslink: ' +
            '<a href="{{link}}">{{link}}</a></p>';

        const data = {
            link: 'http://sumowin.at/#/confirm?c=' + activationToken,
            name: name
        };

        return await this._mailFacade.send({
            data: data,
            subject: 'Hello World',
            template: template,
            to: name + '<' + email + '>'
        });
    }
}
