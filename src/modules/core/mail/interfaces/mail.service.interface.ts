export interface IMailService {
    sendActivationMail(name, email, activationToken): void;
}

export interface IRawMailDataModel {
    to:         string;
    subject:    string;
    html:       string;
}

export interface IMailResponse {
    id:         string;
    message:    string;
}
