import { UserState } from '../models/userstate.model';

export interface IUser {
    id?: string;
    createdOn: string;
    email: string;
    firstName: string;
    image?: string;
    lastName: string;
    modifiedOn: string;
    state: UserState;
}
