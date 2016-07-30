import {UserState} from '../models/userstate.model';
import {IUserDBSchema} from '../models/user.db.model';
export interface IUser {
    createdOn: string;
    email: string;
    firstName: string;
    lastName: string;
    modifiedOn: string;
    password: string;
    userState: UserState;

    toDBmodel(): IUserDBSchema;
}
