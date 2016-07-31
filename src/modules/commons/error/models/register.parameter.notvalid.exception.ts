import {BaseException} from '../../base/base.exception';
export class RegisterParametersNotValid extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

