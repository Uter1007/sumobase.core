import {BaseException} from '../../base/base.exception';
export class UserAlreadyInUseException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}
