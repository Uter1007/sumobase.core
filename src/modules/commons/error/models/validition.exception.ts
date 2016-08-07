import {BaseException} from '../../base/base.exception';
export class ValidationException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

