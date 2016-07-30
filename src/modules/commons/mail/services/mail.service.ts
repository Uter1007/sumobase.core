import { injectable } from 'inversify';
import { MailFacade } from './mail.facade.service';
import { IMailService } from '../interfaces/mail.service.interface';

@injectable()
export class MailService implements IMailService {

    private _mailFacade: any;

    constructor() {
        this._mailFacade = new MailFacade();
    }

    public async sendHelloWorldPlain() {
        const template = '<p>Hello world {{foobar}}</p>';

        const data = { 'foobar': 'foobar'};

        return await this._mailFacade.send({
            to: 'CleanSumoDev <cleansumodev@mailinator.com>',
            subject: 'Hello World',
            template: template,
            data: data
        });
    }

    public async sendActivationMail(name: string, email: string, activationToken: string) {
        const template = '<p>Hallo {{name}},<br>hier ist dein Aktivierungslink: ' +
            '<a href="{{link}}">{{link}}</a></p>';

        const data = {
            name: name,
            link: 'http://cleansumo.at/#/confirm?c=' + activationToken,
        };

        return await this._mailFacade.send({
            to: name + '<' + email + '>',
            subject: 'Hello World',
            template: template,
            data: data
        });
    }
}
