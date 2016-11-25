import {Validator} from 'validator.ts/Validator';
import {ValidationErrorInterface} from 'validator.ts/ValidationErrorInterface';
import {IUser} from '../../models/user.model';

export class UserValidator {
    public static validateUser(user: IUser): ValidationErrorInterface[]  {
        let validator = new Validator();
        return validator.validate(user);
    }
}
