import { injectable } from 'inversify';
import { autoserialize } from 'cerialize';
import {IUser} from '../interfaces/user.interface';
import {IUserDBSchema} from './user.db.model';
import {UserState} from './userstate.model';

@injectable()
export class User implements IUser {

    @autoserialize
    public email: string;

    @autoserialize
    public firstName: string;

    @autoserialize
    public lastName: string;

    @autoserialize
    public userState: UserState;

    @autoserialize
    public password: string;

    @autoserialize
    public createdOn: string;

    @autoserialize
    public modifiedOn: string;

    public static createFromDB(userModel: IUserDBSchema) {
        return new User(userModel.email,
            userModel.password,
            userModel.firstName,
            userModel.lastName,
            userModel.userState,
            userModel.modifiedOn,
            userModel.createdOn);
    }

    public toDBmodel(): IUserDBSchema {
        let userdb = {
            createdOn:  this.createdOn,
            email:      this.email,
            firstName:  this.firstName,
            lastName:   this.lastName,
            modifiedOn: this.modifiedOn,
            password:   this.password,
            userState:  this.userState,
        };
        return <IUserDBSchema>userdb;
    }

    constructor(email, password, firstname, lastname, userState, modifiedOn?, createdOn?) {
        this.email = email;
        this.password = password;
        this.firstName = firstname;
        this.lastName = lastname;
        this.userState = userState;
        this.modifiedOn = modifiedOn;
        this.createdOn = createdOn;
    }
}
