export interface IMailService {
    sendHelloWorldPlain(): void;
    sendActivationMail(name, email, activationToken): void;
}

export interface IRawMailDataModel {
    to:         string;
    subject:    string;
    template:   string;
    data:       Object;
}

export interface IMailResponse {
    id:         string;
    message:    string;
}
