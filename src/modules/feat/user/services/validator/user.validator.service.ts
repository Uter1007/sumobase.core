import {Validator} from 'validator.ts/Validator';
import {IUser} from '../../interfaces/user.interface';
import {ValidationErrorInterface} from 'validator.ts/ValidationErrorInterface';

export class UserValidator {
    public static validateUser(user: IUser): ValidationErrorInterface[]  {
        let validator = new Validator();
        return validator.validate(user);
    }
}
