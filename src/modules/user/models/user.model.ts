import { injectable } from 'inversify';
import { autoserialize } from 'cerialize';
import {IUser} from '../interfaces/user.interface';

@injectable()
export class User implements IUser {

    @autoserialize
    public email: string;

    @autoserialize
    public firstName: string;

    @autoserialize
    public lastName: string;

    constructor(email, firstname, lastname) {
        this.email = email;
        this.firstName = firstname;
        this.lastName = lastname;
    }
}
