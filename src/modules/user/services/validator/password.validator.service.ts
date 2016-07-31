import {PasswordsNotEqualException} from '../../../commons/error/models/password.notequal.exception';
import {PasswordNotComplexException} from '../../../commons/error/models/password.notcomplex.exception';
export class PasswordValidator {

    public static validatePassword(password: string, confirmPassword: string): boolean {
        if (password !== confirmPassword) {
            throw new PasswordsNotEqualException('Passwords not equal');
        }

        let pwRule: RegExp = new RegExp('^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#\$%\^&*])(?=.{8,})');

        if (pwRule.test(password)) {
            return true;
        }

        throw new PasswordNotComplexException('Password not complex enough');
    }
}
