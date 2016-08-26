import {BaseException} from '../../base/base.exception';
export class UserCantLoginException extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 404;
    }
}

