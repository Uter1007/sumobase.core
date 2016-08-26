import {PasswordsNotEqualException} from '../../../../core/error/models/password.notequal.exception';
import {PasswordNotComplexException} from '../../../../core/error/models/password.notcomplex.exception';
export class PasswordValidator {

    public static validatePassword(password: string, confirmPassword: string): boolean {
        if (password !== confirmPassword) {
            throw new PasswordsNotEqualException('Passwords not equal');
        }

        let upperCase = new RegExp('[A-Z]');
        let lowerCase = new RegExp('[a-z]');
        let numbers = new RegExp('[0-9]');
        let specialchars = new RegExp('([!,%,&,@,#,$,^,*,?,_,~])');

        if (password.length > 8 &&
            password.match(upperCase) &&
            password.match(lowerCase) &&
            password.match(numbers) &&
            password.match(specialchars)
        ) {
            return true;
        } else {
            throw new PasswordNotComplexException('Password not complex enough');
        }
    }
}
