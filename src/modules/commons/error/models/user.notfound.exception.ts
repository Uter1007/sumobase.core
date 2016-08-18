import {BaseException} from '../../base/base.exception';
export class    UserNotFoundException extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 404;
    }
}

