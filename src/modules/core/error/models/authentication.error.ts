import {BaseException} from '../../base/base.exception';

export class AuthenticationError extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
    }
}
