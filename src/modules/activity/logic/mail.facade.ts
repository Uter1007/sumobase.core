import {MailService} from './mail.service';
import {IMailService} from '../interfaces/mail.services.interfaces';

export class MailFacade {

    private _mailService: IMailService;

    constructor() {
        this._mailService = new MailService();
    }

    public async sendHelloWorldPlain() {
        const template = '<p>Hello world {{foobar}}</p>';

        const data = { 'foobar': 'foobar'};

        return await this._mailService.send({
            to: 'CleanSumoDev <cleansumodev@mailinator.com>',
            subject: 'Hello World',
            template: template,
            data: data
        });
    }

    public async sendActivationMail(name, email, activationToken) {
        const template = '<p>Hallo {{name}},<br>hier ist dein Aktivierungslink: ' +
            '<a href="{{link}}">{{link}}</a></p>';

        const data = {
            name: name,
            link: 'http://cleansumo.at/#/confirm?c=' + activationToken,
        };

        return await this._mailService.send({
            to: name + '<' + email + '>',
            subject: 'Hello World',
            template: template,
            data: data
        });
    }
}
