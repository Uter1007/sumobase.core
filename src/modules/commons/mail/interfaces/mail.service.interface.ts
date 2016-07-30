export interface IMailService {
    sendHelloWorldPlain(): void;
    sendActivationMail(name, email, activationToken): void;
}
