import {User} from '../models/user.model';
import {Validator} from "validator.ts/Validator";
import {IUser} from '../interfaces/user.interface';

export class UserValidator {
    public static validateUser(user: IUser): void {
        let validator = new Validator();
        validator.validateOrThrow(user);
    }
}
