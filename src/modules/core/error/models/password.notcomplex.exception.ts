import {BaseException} from '../../base/base.exception';
export class PasswordNotComplexException extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 422;
    }
}
