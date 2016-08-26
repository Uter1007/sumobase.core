import {BaseException} from '../../base/base.exception';
export class UnknownException extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 500;
    }
}

