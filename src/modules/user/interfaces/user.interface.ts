import { UserState } from '../models/userstate.model';
import { IUserDBSchema } from '../models/user.db.model';

export interface IUser {
    id: string;
    createdOn: string;
    email: string;
    firstName: string;
    lastName: string;
    modifiedOn: string;
    userState: UserState;

    toDBmodel(): IUserDBSchema;
}
