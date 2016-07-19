export abstract class BaseException extends Error {

    public statusCode: number;

    constructor(message: string) {
        super();
        this.name = 'Exception';
        this.message = message;
        this.stack = (<any> new Error()).stack;
        this.statusCode = 555;
    }
    public toString() {
        return this.name + ': ' + this.message;
    }
}
