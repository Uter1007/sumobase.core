import {BaseException} from '../../base/base.exception';
export class PhotoValidationException extends BaseException {
    constructor(message: string) {
        super(message);
        this.statusCode = 422;
    }
}

